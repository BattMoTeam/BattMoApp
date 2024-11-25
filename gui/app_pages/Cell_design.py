import streamlit as st
import sys
import os
from streamlit_extras.stylable_container import stylable_container

# set config before import to avoid streamlit error
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app_scripts.app_controller import get_app_controller, log_memory_usage, set_acknowlegent_info
from app_scripts import app_view, app_access


def show_cell_design():

    gui_parameters = st.session_state.json_linked_data_input
    app = get_app_controller()

    app.set_cell_design()

    app.set_footer(page=None)