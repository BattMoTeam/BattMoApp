import os
import streamlit as st
import sys
import streamlit.components.v1 as components


sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# set config is done before import to avoid streamlit error
from app_scripts.app_controller import (
    get_app_controller,
    set_page_navigation,
    set_external_links,
    set_acknowlegent_info,
)
from app_scripts import app_view

# from app_scripts.app_session_states import init_session_states

# ##############################
# # Remember user changed values
for k, v in st.session_state.items():
    st.session_state[k] = v

# Remember widget actions when switching between pages (for example: selectbox choice)
st.session_state.update(st.session_state)
# ##############################

# def show_home():

st.text("")
st.text("")

# Description: The theme of the browser (light or dark)
if "themebutton" not in st.session_state:
    st.session_state['themebutton'] = "light"

app = get_app_controller()

# Set header color
app.set_page_design().color_headers()

# Set Introduction page heading wil title, BattMo logo, and BattMo info.
app.set_heading()

app.set_page_design().st_space(space_width=3)

# Set page navigation
col = set_page_navigation()

# Set external links to websites and documentation
app.set_footer(page="Home")
# set_external_links()

with st.sidebar:
    app.set_page_design().st_space(space_width=3)

    # Set funding acknowledgement
    set_acknowlegent_info()
