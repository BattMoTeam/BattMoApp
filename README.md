# BattMoApp

[![](./python/resources/images/battmo_logo.png)](https://github.com/BattMoTeam/BattMo.git)
[![](https://zenodo.org/badge/410005581.svg)](https://zenodo.org/badge/latestdoi/410005581)

The Battery Modelling Toolbox (**BattMo**) is a resource for continuum modelling of electrochemical devices in MATLAB and Julia.
It offers users a flexible framework for building fully coupled electrochemical-thermal simulations of electrochemical
devices using 1D, 2D, or 3D geometries. The original **BattMo** is implemented in MATLAB and builds on the open-source MATLAB
Reservoir Simulation Toolbox (MRST) developed at SINTEF. BattMo being rewritten in Julia and builds on the open source Julia framework for multiphysics simulators, Jutul.jl. This repository builds further upon BattMo.jl.

Additional information about BattMo on the [BattMo repository](https://github.com/BattMoTeam/BattMo.git)

**BattMoApp** is a web-based application which offers a user-friendly interface to
conduct an end to end simulation experience. Each physical quantity needed to define an experimental protocol can be
modified to suit the user's needs. The parameter set thus defined is then used to run the BattMo P2D model.

The application consists of a Web socket API build with **HTTP.jl** and configered to run BattMo simulations, and a graphical user interface build with **Streamlit**.

## Using the application

The BattMo application can very easily be used on [app.batterymodel.com](http://app.batterymodel.com/). If you'd rather use the application offline, it can be installed using Docker. If you'd like to install for development, see the next section called 'Developer installation'. The BattMo GUI is available as a set of Docker images in the Github container registry and can be found among BattMoTeam's packages. In order to use it you have to install Docker and Docker Compose. See the [Docker website](https://www.docker.com/) for more information about Docker and how to install it. Assuming you have both Docker and Docker Compose installed on your machine:

Open a bash terminal and pull the latest Docker images from the registry. For the Docker image that represents the GUI:

```<bash>
docker pull ghcr.io/battmoteam/battmoapp_gui:latest
```

For the Docker image that serves as a Web socket API and runs the BattMo.jl package:

```<bash>
docker pull ghcr.io/battmoteam/battmoapp_api:latest
```

Run the images in containers by using a docker compose file. Create a docker-compose.yml file with the following content:

```<docker>
version: "3.3"

services:

  api:
    image: ghcr.io/battmoteam/battmoapp_api:latest
    container_name: api
    restart: always
    ports:
      - "8081:8081"
      - "8080:8080"
    command: julia --project=. -e 'include("api.jl")' --color=yes --depwarn=no --project=@. --sysimage="pre-compilation/sysimage.so" -q -i -- $$(dirname $$0)/../bootstrap.jl -s=true "$$@"

  gui:
    image: ghcr.io/battmoteam/battmoapp_gui:latest
    container_name: gui
    restart: always
    ports:
      - "8501:8501"
    command: streamlit run app.py --global.disableWidgetStateDuplicationWarning true --server.port=8501
```

Now run the following command to start the containers:

```<bash>
docker-compose up -d
```

Now you can open your browser and go to 'localhost:8501' where **BattMoApp** should be visible and ready to use.

## Developer installation

If you'd like to install the BattMo application for development you need to have both Docker and Docker Compose installed on your computer. See the [Docker website](https://www.docker.com/) for more information about Docker and how to install it. Assuming you have both Docker and Docker Compose installed on your machine:

Clone the repository:

```<git>
git clone https://github.com/BattMoTeam/BattMoApp.git
```

Now the only thing you have to do in order to run the application is to build the images and run the docker containers using Docker Compose. The building setup for the development environment can be found in the file 'docker-compose.yml'. To build the images, go into the BattMo-GUI directory in your terminal and run:

```<bash>
docker-compose build
```

The first build can take up to 20 minutes to finish. After that, it takes a couple of seconds depending on the changes you make during development. To run the containers/application:

```<bash>
docker-compose up -d
```

Now you can go to 'Localhost:8501' in your browser in order to visualize and use the web-application.

After changing anything in the streamlit folder, in order to see the changes in the application you can rerun the webpage or run in your terminal:

```<bash>
docker restart gui
```

After changing anything in the genie folder, in order to see the changes in the application you can run:

```<bash>
docker restart api
```

When changing anything in the recources and database, or in the Julia system image building setup, make sure to rebuild the images again instead of only restarting certain containers.

## Development structure

**BattMoApp** consists or three main components:

- The _gui_ directory contains the Python-based code for the streamlit GUI and a
  database that stores the parameters used to define an experimental protocol (default values, metadata).
- The _api_ directory contains the Julia-based code that uses the HTTP.jl to create a Web socket API. This API enables data transfer between the **BattMo** package and the streamlit GUI and starts a simulation upon receiving input data from the GUI.

This streamlit app is a multipage app
(cf [streamlit doc](https://docs.streamlit.io/library/get-started/multipage-apps/create-a-multipage-app)).
All the pages are stored in the _app_pages_ directory and are specified in the _app.py_ file which includes the general settings of the applications and needs to be executed in order to start the application. Here below is a brief description
of each page.

- **Home** : The starting page, gives an introduction to the app. It provides a description on BattMo, a navigation to the other pages, and links to more information and documentation.

- **Simulation** : Allows user to define all physical quantities needed to define the desired
  experimental protocol. The parameters and metadata (units, IRIs, values from literature) are stored in a SQLite file
  called _BattMo_gui.db_ within the _database_ directory. The parameter values in the page are saved in a json file called _linked_data_input_ (stored in the BattMoJulia directory).
  The _linked_data_input_ file contains all the parameters' metadata; a second file called _battmo_formatted_input_ is also
  created, it's the version used as input by BattMo.jl. After changing the parameters, the user can click on the **RUN** button to launch the simulation, based on the parameters saved in the _battmo_formatted_input_ file.

- **Results** : Plots the results of previous simulations using Plotly.

- **Materials and models**: Provides more information on the models and materials that can be selected.

## Acknowledgements

Contributors, in alphabetical order

- Oscar Bolzinger, SINTEF Industry
- Simon Clark, SINTEF Industry
- Eibar Flores, SINTEF Industry
- Lorena Hendrix, SINTEF Industry

BattMo has received funding from the European Union's Horizon 2020
innovation program under grant agreement numbers:

- 875527 HYDRA
- 957189 BIG-MAP
- 101104013 BATMAX
- 101103997 DigiBatt
- 101069765 IntelLiGent
