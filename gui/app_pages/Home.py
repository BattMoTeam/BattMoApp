import os
import streamlit as st
from streamlit_extras.bottom_container import bottom
import sys


sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# set config is done before import to avoid streamlit error
from app_scripts.app_controller import (
    set_acknowlegent_info,
    get_app_controller,
)
from app_scripts import app_view
from app_scripts.app_session_states import init_session_states


# ##############################
# # Remember user changed values
for k, v in st.session_state.items():
    st.session_state[k] = v

# Remember widget actions when switching between pages (for example: selectbox choice)
st.session_state.update(st.session_state)
# ##############################


def show_home():
    app = get_app_controller()

    # Initiate all session states
    init_session_states()

    # Set header color
    app.set_page_design().color_headers()

    # Set Home page heading with title and info.
    app.set_heading()

    app.set_page_design().st_space(space_width=3)

    # Set page navigation
    # col = set_page_navigation()

    # Set external links to websites and documentation
    app.set_footer(page="Home")

    with st.sidebar:
        app.set_page_design().st_space(space_width=3)

        # Set funding acknowledgement
        set_acknowlegent_info()
