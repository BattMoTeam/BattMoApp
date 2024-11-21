import streamlit as st
import sys
import os
from streamlit_extras.stylable_container import stylable_container
from streamlit_extras.bottom_container import bottom

# set config before import to avoid streamlit error
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app_scripts.app_controller import get_app_controller, log_memory_usage, set_acknowlegent_info
from app_scripts import app_view, app_access


def show_build_model():

    app = get_app_controller()
    app.set_build_model()
    app.set_footer(page=None)
