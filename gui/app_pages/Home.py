import os
import streamlit as st
from streamlit_extras.bottom_container import bottom
import sys
import streamlit.components.v1 as components


sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# set config is done before import to avoid streamlit error
from app_scripts.app_controller import (
    set_acknowlegent_info,
    get_app_controller,
)
from app_scripts import app_view
from app_scripts.app_session_states import init_session_states

# components.html(
#     '<script defer src="https://app.batterymodel.com/umami.js" data-website-id="213d7c39-2f27-43d9-822e-7e0e855273db"></script>'
# )

# components.html(
#     '<script defer src="https://cloud.umami.is/script.js" data-website-id="adcac53d-bc65-4ca3-9f98-be5c7c4ee75d"></script>'
# )
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
