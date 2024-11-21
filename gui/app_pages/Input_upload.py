import streamlit as st
import sys
import os
from streamlit_extras.stylable_container import stylable_container
from streamlit_extras.bottom_container import bottom

# set config before import to avoid streamlit error
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app_scripts.app_controller import get_app_controller, log_memory_usage, set_acknowlegent_info
from app_scripts import app_view, app_access


def show_upload():

    if "json_uploaded_input" not in st.session_state:
        st.session_state.json_uploaded_input = None

    if "upload" not in st.session_state:
        st.session_state.upload = None

    if "clear_upload" not in st.session_state:
        st.session_state.clear_upload = None

    app = get_app_controller()

    uploaded_json = app.set_input_upload().uploaded_input_dict

    if uploaded_json:

        st.write(uploaded_json)

    # else:
    #     get_default_parameter_dict()

    app.set_footer(page=None)
