import streamlit as st
import numpy as np
from PIL import Image
import os
import sys
import html
import json
import sympy as sp


# ##############################
# # Remember user changed values
for k, v in st.session_state.items():
    st.session_state[k] = v

# Remember widget actions when switching between pages (for example: selectbox choice)
st.session_state.update(st.session_state)
# ##############################

# set config is done before import to avoid streamlit error
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app_scripts import app_access, app_view

from app_scripts.app_controller import (
    set_model_description,
    set_material_description,
    get_app_controller,
)


def show_simulator_components():

    app = get_app_controller()

    # Set header color
    app.set_page_design().color_headers()

    app.set_footer(page="Analyze")

    # Select model
    model_id = app.set_model_choice().selected_model

    # Select cell design
    cell_design_id = app.set_cell_design_choice().selected_cell_design
