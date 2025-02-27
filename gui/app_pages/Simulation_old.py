import os
import sys
from PIL import Image
import streamlit as st
import pprint
import pdb
import pickle
import json
import numpy as np
import tempfile
import uuid
import h5py
from streamlit_extras.stylable_container import stylable_container


# ##############################
# # Page Config
# path_to_images = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "images")
# st.set_page_config(
#     page_title="BattMo",
#     page_icon=Image.open(os.path.join(path_to_images, "battmo_logo.png")),
# )
# ##############################

# set config before import to avoid streamlit error
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app_scripts.app_controller import get_app_controller, log_memory_usage, set_acknowlegent_info
from app_scripts import app_view, app_access


# with open(app_access.get_path_to_custom_style_css()) as f:
#     style = st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

##############################
# Remember user changed values when switching between pages
for k, v in st.session_state.items():
    st.session_state[k] = v

# Remember widget actions when switching between pages (for example: selectbox choice)
st.session_state.update(st.session_state)
##############################


def show_simulation_old():
    page_name = "Simulation"

    log_memory_usage()

    app = get_app_controller()

    # Set header color
    app.set_page_design().color_headers()

    app.set_footer(page=None)

    model_id = app.set_model_choice().selected_model

    # if st.session_state.simulation_successful and st.session_state.transfer_results:
    #     st.session_state["toast"](":green-background[Gathering the results!]", icon="💤")

    gui_parameters = app.set_tabs(model_id).user_input

    app.set_indicators(page_name)
    # st.divider()

    # app.set_geometry_visualization(gui_parameters)

    app.download_parameters(gui_parameters)

    simulation_successful = app.run_simulation(gui_parameters).simulation_successful

    if st.session_state.simulation_completed == True:

        # with h5py.File(app_access.get_path_to_battmo_results(), "r") as f:
        #     data = f

        save_run = st.container()
        app.divergence_check(save_run, True)

    if st.session_state.simulation_successful and st.session_state.transfer_results:
        # st.session_state["toast"](
        #     ":green-background[Find your results on the results page!]", icon="✅"
        # )
        st.session_state.simulation_successful = None
        st.session_state.simulation_completed = None

    st.session_state.response = None

    ############################################
    # Can be used to check the structure of gui_parameters in the terminal
    # pp = pprint.PrettyPrinter(indent=2)
    # pp.pprint(gui_parameters)
    # pdb.set_trace()
    ############################################
