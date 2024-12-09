import os
import sys
import streamlit as st


sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# set config is done before import to avoid streamlit error
from app_scripts.app_controller import (
    get_app_controller,
)

# ##############################
# # Remember user changed values
for k, v in st.session_state.items():
    st.session_state[k] = v

# Remember widget actions when switching between pages (for example: selectbox choice)
st.session_state.update(st.session_state)
# ##############################


def show_protocol():

    gui_parameters = st.session_state.json_linked_data_input
    app = get_app_controller()

    model_id = st.session_state.selected_model

    gui_parameters = app.set_tabs(model_id).user_input

    app.set_footer(page=None)
