# BattMoApp

[![](./python/resources/images/battmo_logo.png)](https://github.com/BattMoTeam/BattMo.git)  
[![](https://zenodo.org/badge/410005581.svg)](https://zenodo.org/badge/latestdoi/410005581)

The **Battery Modelling Toolbox (BattMo)** is a resource for continuum modelling of electrochemical devices in MATLAB and Julia.  
It offers users a flexible framework for building fully coupled electrochemical-thermal simulations of batteries and other electrochemical devices in 1D, 2D, or 3D.

The original **BattMo** was implemented in MATLAB (building on MRST developed at SINTEF). A new implementation is being developed in **Julia**, building on the open-source multiphysics framework **Jutul.jl**.  
This repository builds further upon **BattMo.jl** and provides a **graphical application** for setting up, running, and visualizing BattMo simulations.

Additional information about BattMo can be found in the [main BattMo repository](https://github.com/BattMoTeam/BattMo.git).

## Two Versions

BattMoApp provides a user-friendly interface to run BattMo simulations. It is available in two forms:

1. **Demo Version (Web Application)**

   - Deployable on a server via **Docker**
   - Includes a Next.js GUI and a Julia WebSocket backend
   - Accessible through the browser

2. **Advanced Version (Desktop Application)**
   - Built with **Electron**
   - Bundles the Next.js GUI and a compiled Julia backend into a single cross-platform desktop app
   - Runs fully offline, no Julia installation required

## Running the application

### Demo web application

The demo web application is available at [app.batterymodel.com](https://app.batterymodel.com/)

### Advanced desktop application

The desktop application can be downloaded from ...

## Development

### Application structure

BattMoApp consists of three main parts:

- Frontend (Next.js): Provides a multipage React-based GUI for defining simulation parameters, running models, and visualizing results.
- Backend (Julia WebSocket API): Uses HTTP.jl to expose BattMo simulation capabilities as a WebSocket service.
  - Shared backend code lives in core/julia-backend/
  - The web demo runs the backend as a Docker service
  - The desktop version bundles it as a compiled executable
- Packaging Layer
  - Docker for the web demo
  - Electron for the desktop app

### Repository Structure

```
battmo/
├─ core/ # Shared code for frontend + backend
│ ├─ nextjs/ # Core React components and pages
│ └─ julia/ # Core Julia backend modules
│
├─ web/ # Web demo version
│ ├─ battmo-api/ # Web-specific backend code
│ ├─ nextjs-gui/ # Web-specific frontend code
│ ├─ nginx/ # Proxy management
│ ├─ streamlit-gui/ # Old Streamlit-based GUI
│ └─ ...
│
├─ desktop/ # Advanced desktop version
│ ├─ nextjs-gui/ # Desktop-specific frontend extensions
│ ├─ electron/ # Electron config
│ └─ battmo_api/ # Compiled Julia executables for packaging
│
└─ README.md
```

### Installation and workflow

Clone the repository:

```
git clone https://github.com/BattMoTeam/BattMoApp.git
```

#### Web application

For development on the web application, make sure you have _Docker_ and _docker-compose_ installed. For more information on docker, visit [docker.com](https://www.docker.com/).

Go into the _web_ folder.

```
cd web
```

The file "docker-compose.yml" consists the docker compose setup for development. First build the images:

```
docker-compose build
```

Then run the container:

```
docker-compose up -d
```

Now the application should be available at `http://localhost:3000`. The docker-compose file has been set up in such a way that changes within the NextJS code are immediately shown within the application after refreshing the browser and changes in the Julia-based code after restarting the container.

#### Desktop application

For development on the NextJS frontend for the desktop version, go into the desktop folder

```
cd desktop
```

and run the development GUI.

```
npm run dev
```

## Acknowledgements

Contributors, in alphabetical order:

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
