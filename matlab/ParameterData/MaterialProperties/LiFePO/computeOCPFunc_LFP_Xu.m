function [OCP, dUdT] = computeOCPFunc_LFP_Xu(c, T, cmax)
%% TODO : implement function model to avoid reading
    
    stoc = c./cmax;

    data = [0.00, 4.1433
            0.01, 3.9121
            0.02, 3.7272
            0.03, 3.6060
            0.04, 3.5326
            0.05, 3.4898
            0.10, 3.4360
            0.15, 3.4326
            0.20, 3.4323
            0.25, 3.4323
            0.30, 3.4323
            0.35, 3.4323
            0.40, 3.4323
            0.45, 3.4323
            0.50, 3.4323
            0.55, 3.4323
            0.60, 3.4323
            0.65, 3.4323
            0.70, 3.4323
            0.75, 3.4323
            0.80, 3.4322
            0.85, 3.4311
            0.90, 3.4142
            0.95, 3.2515
            0.96, 3.1645
            0.97, 3.0477
            0.98, 2.8999
            0.99, 2.7312
            1.00, 2.5895];

    OCP = interpTable(data(:, 1), data(:, 2), stoc);

    data = [9.51362e-3, -4.04346e-4
            1.47563e-2, -2.98844e-4
            1.88127e-2, -2.07750e-4
            2.96637e-2, -1.51978e-4
            3.93120e-2, -1.03643e-4
            4.33465e-2, -3.25336e-6
            4.85859e-2, 1.03643e-4
            7.50118e-2, 2.27735e-5
            9.89830e-2, -5.20537e-5
            1.48402e-1, -5.15890e-5
            1.98433e-1, -5.15890e-5
            2.46058e-1, -6.64615e-5
            2.98568e-1, -8.31930e-5
            3.76665e-1, -8.31930e-5
            4.72455e-1, -8.31930e-5
            5.49330e-1, -8.27282e-5
            5.99287e-1, -5.15890e-5
            6.48694e-1, -4.60118e-5
            6.99324e-1, -4.13641e-5
            7.49958e-1, -3.85755e-5
            7.99373e-1, -3.62517e-5
            8.48853e-1, -6.18138e-5
            8.98889e-1, -6.41376e-5
            9.48941e-1, -7.29682e-5
            9.62152e-1, -2.42143e-4
            9.79765e-1, -4.67089e-4
            9.84685e-1, -2.24482e-4
            9.89111e-1, -3.11393e-5];

    dUdT = interpTable(data(:, 1), data(:, 2), stoc);
    
end
