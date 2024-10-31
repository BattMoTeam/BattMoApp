import os
import streamlit as st
from streamlit_extras.bottom_container import bottom
import sys


sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# set config is done before import to avoid streamlit error
from app_scripts.app_controller import (
    set_heading,
    set_page_navigation,
    set_external_links,
    set_acknowlegent_info,
    get_app_controller,
)
from app_scripts import app_view


# ##############################
# # Remember user changed values
for k, v in st.session_state.items():
    st.session_state[k] = v

# Remember widget actions when switching between pages (for example: selectbox choice)
st.session_state.update(st.session_state)
# ##############################


def show_home():

    st.text("")
    st.text("")
    app = get_app_controller()

    # Set Introduction page heading wil title, BattMo logo, and BattMo info.
    set_heading()

    app_view.st_space(space_width=3)

    # Set page navigation
    # col = set_page_navigation()

    # Set external links to websites and documentation
    app.set_footer(page="Home")

    with st.sidebar:
        app_view.st_space(space_width=3)

        # Set funding acknowledgement
        set_acknowlegent_info()
