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
from database import db_handler

from app_scripts.app_controller import (
    set_model_description,
    set_material_description,
    get_app_controller,
)


def show_library_user():

    app = get_app_controller()

    # Set header color
    app.set_page_design().color_headers()

    sql_cell = db_handler.CellHandler()

    cells = sql_cell.get_all_user(st.session_state.uuid_user_session)
    st.write(cells)
    app.set_footer(case="toggle_eu")

    st.text("")
    st.text("")
