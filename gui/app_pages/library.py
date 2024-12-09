import os
import sys
import streamlit as st


sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# set config is done before import to avoid streamlit error
from app_scripts.app_controller import get_app_controller

# ##############################
# # Remember user changed values
for k, v in st.session_state.items():
    st.session_state[k] = v

# Remember widget actions when switching between pages (for example: selectbox choice)
st.session_state.update(st.session_state)
# ##############################


def show_library():

    app = get_app_controller()

    st.header("Parameter sets", divider="orange")

    st.write("Within this app you can make use of mulptilple pre-defined parameter sets.")

    st.text("")
    st.text("")

    app.set_material_description()
    st.text("")

    st.markdown("#### " + " The available cell designs")

    st.multiselect("default cell designs", options=["example1", "example2"])

    # Set external links to websites and documentation
    app.set_footer(page=None)
