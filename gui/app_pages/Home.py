import os
import streamlit as st
import sys
import streamlit.components.v1 as components


sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# set config is done before import to avoid streamlit error
from app_scripts.app_controller import (
    set_heading,
    set_page_navigation,
    set_external_links,
    set_acknowlegent_info,
)
from app_scripts import app_view

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

# def show_home():

st.text("")
st.text("")

# Set Introduction page heading wil title, BattMo logo, and BattMo info.
set_heading()

app_view.st_space(space_width=3)

# Set page navigation
col = set_page_navigation()

# Set external links to websites and documentation
set_external_links()

with st.sidebar:
    app_view.st_space(space_width=3)

    # Set funding acknowledgement
    set_acknowlegent_info()
