module runP2DBattery

    using BattMo, Logging,Jutul
    using HTTP
    using HTTP.WebSockets

    export runP2DBatt

    

    function runP2DBatt(json_file,ws)
        log_messages = String[]
        log_buffer = nothing
        fraction_tot = 0
        dt_tot = 0
        i = 0
        inputparams = readBattMoJsonInputFile(json_file)

        log_file = "simulation_log.log"  # Define the log file name
        open(log_file, "w") do file

            redirect_stdout(file)
            redirect_stderr(file)

            try
                # Create a custom IOBuffer to capture log messages
                log_buffer = IOBuffer();

                # Redirect the logger to use the custom IOBuffer
                global_logger(ConsoleLogger(log_buffer));

                # setup simulation from the input parameters
                output = setup_simulation(inputparams)

                simulator = output[:simulator]
                model     = output[:model]
                state0    = output[:state0]
                forces    = output[:forces]
                timesteps = output[:timesteps]    
                cfg       = output[:cfg] 

                # We modify the configuration using specific setup
                cfg = setup_config(cfg         ,
                model       ,
                timesteps   ,
                fraction_tot,
                dt_tot      ,
                ws,
                i)

                print("Calling BattMo simulation")
                states, reports = simulate(state0, simulator, timesteps; forces = forces, config = cfg)

                energy_efficiency = computeEnergyEfficiency(states);
                discharge_energy = computeCellEnergy(states);

                print("Simulation finished")

                con = BattMo.Constants();

                # Get some result values
                
                number_of_states = size(states);
                time_values = cumsum(timesteps)/con.hour;
                cell_voltage = [state[:Control][:Phi][1] for state in states];
                cell_current = [state[:Control][:Current][1] for state in states];
                negative_electrode_grid_wrap = physical_representation(model[:NeAm]);
                electrolyte_grid_wrap = physical_representation(model[:Elyte]);
                positive_electrode_grid_wrap = physical_representation(model[:PeAm]);
                negative_electrode_concentration = Array([[state[:NeAm][:Cs] for state in states]/1000]);
                electrolyte_concentration = [state[:Elyte][:C] for state in states]/1000;
                positive_electrode_concentration = Array([[state[:PeAm][:Cs] for state in states]]/1000);
                negative_electrode_potential = [state[:NeAm][:Phi] for state in states];
                electrolyte_potential = [state[:Elyte][:Phi] for state in states];
                positive_electrode_potential = [state[:PeAm][:Phi] for state in states];

                nsteps = length(cell_voltage);
                time_values = time_values[1 : nsteps];

                # Mesh cell centroids coordinates
                centroids_NeAm = negative_electrode_grid_wrap[:cell_centroids, Cells()];
                centroids_Elyte = electrolyte_grid_wrap[:cell_centroids, Cells()];
                print(centroids_Elyte)
                centroids_PeAm = positive_electrode_grid_wrap[:cell_centroids, Cells()];

                # Boundary faces coordinates
                boundaries_NeAm = negative_electrode_grid_wrap[:boundary_centroids, BoundaryFaces()];
                boundaries_Elyte = electrolyte_grid_wrap[:boundary_centroids, BoundaryFaces()];
                boundaries_PeAm = positive_electrode_grid_wrap[:boundary_centroids, BoundaryFaces()];

                negative_electrode_grid = centroids_NeAm.*10^6;
                negative_electrode_grid_bc = boundaries_NeAm.*10^6;
                electrolyte_grid = centroids_Elyte.*10^6;
                electrolyte_grid_bc = boundaries_Elyte.*10^6;
                positive_electrode_grid = centroids_PeAm.*10^6;
                positive_electrode_grid_bc = boundaries_PeAm.*10^6;
                negative_electrode_concentration = negative_electrode_concentration[1];
                positive_electrode_concentration = positive_electrode_concentration[1];

                print("Number of states = ", size(states))

                log_messages = split(String(take!(log_buffer)), "\n");

                
                return log_messages, number_of_states, cell_voltage, cell_current, time_values, negative_electrode_grid, negative_electrode_grid_bc, electrolyte_grid, electrolyte_grid_bc, positive_electrode_grid, positive_electrode_grid_bc, negative_electrode_concentration, electrolyte_concentration, positive_electrode_concentration, negative_electrode_potential, electrolyte_potential, positive_electrode_potential,discharge_energy,energy_efficiency
            catch e
                println("Simulation failed: $e")

                number_of_states = [0]
                cell_voltage = [0]
                cell_current = [0]
                time_values = [0]
                negative_electrode_grid = [0]
                negative_electrode_grid_bc = [0]
                electrolyte_grid = [0]
                electrolyte_grid_bc = [0]
                positive_electrode_grid = [0]
                positive_electrode_grid_bc = [0]
                negative_electrode_concentration = [0]
                electrolyte_concentration = [0]
                positive_electrode_concentration = [0]
                negative_electrode_potential = [0]
                electrolyte_potential = [0]
                positive_electrode_potential = [0]
                discharge_energy = [0]
                energy_efficiency = [0]

                # Capture log messages
                seekstart(log_buffer);
                log_messages = split(String(take!(log_buffer)), "\n");
                return log_messages, number_of_states, cell_voltage, cell_current, time_values, negative_electrode_grid, negative_electrode_grid_bc, electrolyte_grid, electrolyte_grid_bc, positive_electrode_grid, positive_electrode_grid_bc, negative_electrode_concentration, electrolyte_concentration, positive_electrode_concentration, negative_electrode_potential, electrolyte_potential, positive_electrode_potential,discharge_energy,energy_efficiency

            finally
                close(log_buffer)  
            end
        end
    end

    function send_simulation_progress(ws::WebSocket, progress::Float64)
        try
            WebSockets.send(ws, "Simulation progress: $progress")
        catch e
            @error "Failed to send progress update: $e"
        end
    end


    function setup_config(cfg              ,
        model::MultiModel,
        timesteps        ,
        fraction_tot     ,
        dt_tot           ,
        ws,
        i)

        if model[:Control].system.policy isa CyclingCVPolicy

            cfg[:tolerances][:global_convergence_check_function] = (model, storage) -> BattMo.check_constraints(model, storage);

            function post_hook(done, report, sim, dt, forces, max_iter, cfg)

                s = Jutul.get_simulator_storage(sim);
                m = Jutul.get_simulator_model(sim);

                if s.state.Control.ControllerCV.numberOfCycles >= m[:Control].system.policy.numberOfCycles
                    report[:stopnow] = true
                else
                    report[:stopnow] = false
                end

                if done 
                    
                    total_time = length(timesteps)
                    println("total time = ", total_time)
                    dt_tot += dt
                    println("progress dt= ", dt_tot)
                    fraction = i/total_time
                    fraction_tot += fraction
                    i +=1
                    println("progress fraction= ", fraction_tot)
                    println("progress i= ", i)
                    send_simulation_progress(ws,fraction)
                end

                return (done, report)

            end

            cfg[:post_ministep_hook] = post_hook

        end

        return cfg

    end

end