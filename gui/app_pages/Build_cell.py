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
    get_app_controller,
)


def show_build_cell():
    app = get_app_controller()

    # Set header color
    app.set_page_design().color_headers()

    cell_dict = app.set_build_cell().cell_dict

    app.set_footer(case="toggle_eu_save_cell", parameter_dict=cell_dict)
