FROM python:3.11.4

WORKDIR /app

RUN pip install jill Flask flask_restful juliacall Pylance streamlit streamlit_extras numpy flask_restful h5py matplotlib sympy --no-cache-dir
# julia is pyjulia, our python-julia interface
# jill is a python package for easy Julia installation


RUN jill install 1.9.2 --confirm

# PyJulia setup (installs PyCall & other necessities)
#RUN python -c "import julia; julia.install()"

# Helpful Development Packages
RUN julia -e 'using Pkg; Pkg.add(["Jutul","LoggingExtras","PythonCall", "BattMo"])'