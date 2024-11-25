import streamlit as st
import numpy as np
from PIL import Image
import os
import sys
import html
import json
import sympy as sp
from streamlit_extras.stylable_container import stylable_container


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
    set_acknowlegent_info,
    get_app_controller,
)


def show_materials_and_models():

    app = get_app_controller()

    st.header("Parameter sets", divider="orange")

    st.write("Within this app you can make use of mulptilple pre-defined parameter sets.")

    st.text("")
    st.text("")

    set_material_description()
    st.text("")

    st.markdown("#### " + " The available cell designs")

    st.multiselect("default cell designs", options=["example1", "example2"])

    st.text("")
    st.text("")
    st.text("")
    col1, col2 = st.columns(2)

    with col1:
        with stylable_container(
            key="container",
            css_styles="""
                {
                    background-color: #F0F0F0;
                    color: black;
                    border-radius: 15px;
                    border: 4px solid #770737;
                    height: 25px;
                    padding: 5px; /* Padding to give some space inside */

                }
                /* Specific styling for headers within the container */
                h1, h2, h3, h4, h5, h6 {
                    color: #770737; /* Make header text white */
                }
                """,
        ):

            cont = st.container()

            with cont:
                uploaded_json = app.set_input_upload().uploaded_input_dict

    with col2:
        with stylable_container(
            key="container",
            css_styles="""
                {
                    background-color: #F0F0F0;
                    color: black;
                    border-radius: 15px;
                    border: 4px solid #770737;
                    height: 25px;
                    padding: 5px; /* Padding to give some space inside */

                }
                """,
        ):

            cont3 = st.container()

            with cont3:
                app.download_parameters(st.session_state.json_linked_data_input)
                st.text("")
                st.text("")
                st.text("")
                st.text("")
                st.text("")

    if uploaded_json:

        st.write(uploaded_json)

    app.set_footer(page=None)

    # with st.sidebar:
    #     app_view.st_space(space_width=3)
    #     set_acknowlegent_info()
