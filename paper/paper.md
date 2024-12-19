---
title: "BattMoApp: A Web-Based application for running cell-level battery simulations"
tags:
  - BattMo
  - Python
  - julia
  - graphical user interface
  - battery simulation
  - battery cell
  - PXD model
  - streamlit
  - battery
  - web application
authors:
  - name: Lorena Hendrix
    orcid: 0009-0006-9621-6122
    affiliation: 1
  - name: Simon Clark*
    orcid: 0000-0002-8758-6109
    affiliation: 1
  - name: Oscar Bolzinger
    affiliation: 1
  - name: Eibar Flores
    orcid: 0000-0003-2954-1233
    affiliation: 1

affiliations:
  - name: SINTEF Industry, Norway
    index: 1
date: 19 December 2024
bibliography: paper.bib
---

# Summary

BattMoApp is a web-based application built upon the command-line based battery modelling software, BattMo [@BattMo]. It features a user-friendly graphical interface that simplifies the simulation of battery cells. The development of BattMoApp has been centered on accessibility, intuitiveness, and usability, with the aim of making it a practical and valuable tool for both educational and research purposes in the battery field. Its design allows users to simulate, obtain, analyze, and compare results within just a few minutes. While BattMoApp leverages a small yet crucial portion of BattMo's capabilities, its intuitive and explanatory design also makes it an ideal starting point for those looking to explore the more comprehensive and complex BattMo software.

# Statement of need

The Battery Modelling Toolbox (BattMo) is a framework for continuum modeling of electrochemical devices. Built primarily in MATLAB [@MATLAB], it offers a pseudo X-dimensional (PXD) framework for the Doyle-Fuller-Newman model of lithium-ion battery cells. Additionally, extensions for other battery chemistries and hydrogen systems are in development. BattMo provides a flexible framework for creating fully coupled electrochemical-thermal simulations of electrochemical devices using 1D, 2D, or 3D geometries. Besides the MATLAB toolbox, the framework is also being developed in Julia [@julia] to leverage increased simulation speed and the non-proprietary nature of Julia.

The primary objective of BattMoApp is to unlock access to battery simulations for users without coding experience. Most researchers who can benefit from battery simulations are not familier with any scripting language. A simple to use graphical user interface brings battery simulations to laboratory engineers and battery scientists who can use the results to inform their cell design and development activities.

BattMoApp builds upon the P2D model implemented in the Julia version of BattMo, see @BattMo. The development of BattMoApp has focused on accessibility, intuitiveness, and usability. Users can quickly and easily obtain results using the default input parameter sets available in the application or input their own values in a straightforward manner. The results can be easily analyzed and compared using the predefined plots that can handle multiple sets of simulation results. Users can also download their results and later upload them back into the application to review. Furthermore, significant effort has been made to ensure the parameters are realistic for both computational research and lab use, making it easier for experimentalists to fulfill the necessary inputs.

Another important aspect that was kept in mind during the development of BattMoApp is interoperability. To ensure that the input data of the simulation is inter-operable, the selected data format adheres to the FAIR principles [@FAIR] and the 5-star open data guidelines [@STAR_LD]. The data entered by the user is automatically formatted into a JSON [@json] Linked Data (LD) format which includes all the semantic metadata along with the actual data. This semantic data connects the actual data to the ontology documentations, EMMO [@EMMO] and BattINFO [@BattINFO], which contain descriptions of the linked data definitions. If the user wishes to publish their results, they can include the JSON LD file in their publication, allowing anyone seeking to replicate the results to simply upload the JSON LD file into BattMoApp and obtain the anticipated results.

The documentation of BattMoApp includes an overview on what the application has to offer and a troubleshooting section that provides insights into the relationship between input parameters and results. As BattMoApp has a graphical and explanatory nature, it can also be a powerful tool for educational purposes, helping students understand batteries, battery modelling, and the impact of material and cell design parameters on battery cell performance.

# Technical setup

The application consists of two main components: the graphical user interface (GUI), which includes the frontend, a database, and the backend that provides the frontend's functionality, and the application programming interface (API) which runs the BattMo software on a web socket server. These two components are isolated from each other, each running in its own Docker [@docker] container.

### BattMo GUI

The frontend is Python-based [@python] and developed using the Streamlit framework [@streamlit]. Streamlit was chosen due to its user-friendly framework that greatly accelerates the development process. The database that supports the frontend is created using the sqlite3 Python package [@sqlite].

### BattMo API

The web socket API runs BattMo.jl. Integrating Julia, a pre-compiled language, with Python, a runtime language, to form a smoothly running and stable application turned out to be complex. Therefore, a Julia-based web socket API was created and containerized within a separate Docker container, isolating the Julia environment from the python environment. The web socket API has been created using the Julia package HTTP [@http] and includes a system image of BattMo's pre-compilation to ensure an instantanious API response.

# Examples

The application provides a list of features:

\begin{itemize}
\item Access to parameter sets from literature, and customization of these sets.
\item Download input parameter values as a BattMo formatted JSON file or as a linked data formatted JSON file.
\item Upload previously downloaded input parameters to quickly review and alter previous simulations.
\item Visualization of 3D grids.
\item P2D model.
\item Quick calculations of key indicators.
\item Interactive plots that zoom, hover, and downloads PNGs.
\item Visualization of not only voltage curves but also internal states to provide further insight into gradients of concentrations and potentials.
\item Comparison of multiple simulation results.
\item Download full results in HDF5 format.
\item Upload previously downloaded results to quickly review them.
\end{itemize}

The following figures display screenshots of the application's 'Simulation' and 'Results' pages. On the 'Simulation' page, \autoref{fig:simulation}, users can define input parameters, visualize their cell geometry, and initiate a simulation. The 'Results' page then allows for the visualization of simulation outcomes using predefined plots. In \autoref{fig:results}, the results of two simulations are visualized to show an example. The two simulations were conducted using the default parameter sets retrieved from @chen2020 with the electrode coating thicknesses varied to illustrate a comparison of results. Both pages also present key indicators of the battery cell, such as capacities, cell energy, and round-trip efficiency.

![A screenshot of the Simulation page of BattMoApp. \label{fig:simulation}](BattMo_Simulation.png)

![A screenshot of the Results page of BattMoApp. \label{fig:results}](BattMo_Results.png)

# Future work

While BattMoApp has reached a mature state and offers a valuable platform for P2D simulations, there are still countless possibilities for further development. Its evolution will continue in parallel with BattMo.jl, allowing for the future integration of additional simulation models and features like parameterization. BattMoApp will continue seeking feedback from its target audience to enhance usability and practicality. Additionally, more effort will be dedicated to improving the performance of the BattMo GUI to improve user interactivity.

# Installation

`BattMoApp` can easily be used online at the following address: [app.batterymodel.com](https://app.batterymodel.com/). Furthermore, it can be installed locally using Docker. The Docker images and a detailed instruction on how to install `BattMoApp` locally can be found in the [Github repository](https://github.com/BattMoTeam/BattMoApp).

# Acknowledgements

The authors acknowledge Francesca Watson and Olav Møyner for their guidance and support.
BattMoApp has received funding from the European Union's Horizon 2020 innovation program under grant agreement no. 875527 (HYDRA), no. 957189 (BIG-MAP), no. 101069765 (IntelLiGent), no. 101104013 (BATMAX), and no. 101103997 (DigiBatt).

# References
