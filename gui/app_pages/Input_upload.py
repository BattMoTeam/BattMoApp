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

    gui_parameters = st.session_state.json_linked_data_input
    app = get_app_controller()

    if "json_uploaded_input" not in st.session_state:
        st.session_state.json_uploaded_input = {}

    if "json_battmo_formatted_input" not in st.session_state:
        st.session_state.json_battmo_formatted_input = {}

    if "json_linked_data_input" not in st.session_state:
        st.session_state.json_linked_data_input = {}

    # cont = st.container()

    # _, left, middle, right = cont.columns((0.5, 1, 4, 1))

    # with left:

    #     # Use stylable_container to apply custom styles
    #     left_arrow_button_css = """
    #         button {
    #             background-color: transparent;
    #             border: none;
    #             width: 0;
    #             height: 0;
    #             border-right: 40px solid #770737;
    #             border-top: 25px solid transparent;
    #             border-bottom: 25px solid transparent;
    #             cursor: pointer;
    #         }

    #         button:hover {
    #             border-left-color: darkgreen; /* Change color on hover */
    #         }

    #     """

    #     # Use stylable_container to style only the specific arrow button
    #     with stylable_container(
    #         key="arrow_button_left",
    #         css_styles=left_arrow_button_css,
    #     ):
    #         st.button("", key="left_button")  # Empty label because the shape is generated using CSS

    # with right:

    #     # Use stylable_container to apply custom styles
    #     right_arrow_button_css = """
    #         button {
    #             background-color: transparent;
    #             border: none;
    #             width: 0;
    #             height: 0;
    #             border-left: 40px solid #770737;
    #             border-top: 25px solid transparent;
    #             border-bottom: 25px solid transparent;
    #             cursor: pointer;
    #         }

    #         button:hover {
    #             border-left-color: darkgreen; /* Change color on hover */
    #         }

    #     """

    #     # Use stylable_container to style only the specific arrow button
    #     with stylable_container(
    #         key="arrow_button_right",
    #         css_styles=right_arrow_button_css,
    #     ):
    #         st.button(
    #             "", key="right_button"
    #         )  # Empty label because the shape is generated using CSS

    uploaded_json = app.set_input_upload().uploaded_input_dict

    if uploaded_json:

        st.write(uploaded_json)
