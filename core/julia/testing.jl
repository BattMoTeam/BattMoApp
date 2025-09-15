using BattMo, Arrow, DataFrames

input = load_full_simulation_input(; from_file_path = "Chen2020.json")


function simulation_progress(converged, report, storage, model, dt, forces, config, iteration)


	return converged

end

output = run_simulation(input; logger = simulation_progress)

time_series = get_output_time_series(output)
states = get_output_states(output)
metrics = get_output_metrics(output)

df = DataFrame(
	Time = time_series[:Time],
	Voltage = time_series[:Voltage],
	Current = time_series[:Current],
	Capacity = time_series[:Capacity], ElectrolyteCharge = states[:ElectrolyteCharge],
	ElectrolyteConcentration = states[:ElectrolyteConcentration],
	ElectrolyteConductivity = states[:ElectrolyteConductivity],
	ElectrolyteDiffusivity = states[:ElectrolyteDiffusivity],
	ElectrolyteMass = states[:ElectrolyteMass],
	ElectrolytePotential = states[:ElectrolytePotential],
	NegativeElectrodeActiveMaterialChargeC = states[:NegativeElectrodeActiveMaterialChargeC],
	ElectrolyteCharge = states[:ElectrolyteCharge],
	ElectrolyteCharge = states[:ElectrolyteCharge],
	ElectrolyteCharge = states[:ElectrolyteCharge],
	ElectrolyteCharge = states[:ElectrolyteCharge],
	ElectrolyteCharge = states[:ElectrolyteCharge],
	ElectrolyteCharge = states[:ElectrolyteCharge],
	ElectrolyteCharge = states[:ElectrolyteCharge],)

Arrow.write("input.arrow")
