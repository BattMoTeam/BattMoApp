import streamlit as st
import uuid
import tempfile
import numpy as np


class SessionStates:

    def __init__(self):
        pass

    def set_key_and_session_state(self, label, id, value):

        key = "key_{}_{}".format(label, id)

        if key not in st.session_state:
            st.session_state[key] = value

        return key

    def init_global_session_states(self):

        #################################
        # General app session states
        #################################

        # Type: string
        # Description: The theme of the browser (light or dark)
        if "themebutton" not in st.session_state:
            st.session_state['themebutton'] = "light"

        # Type: string
        # Description: a UUID for the user session
        if "uuid_user_session" not in st.session_state:
            st.session_state["uuid_user_session"] = str(uuid.uuid4())

        # Type: string
        # Description: the path of the temporary directory created for each unique user session
        if "temporary_directory" not in st.session_state:
            unique_id = st.session_state["uuid_user_session"]
            temporary_directory = tempfile.mkdtemp(prefix=f"session_{unique_id}_")
            st.session_state["temporary_directory"] = temporary_directory

        # Type: Int
        # Description: Stores the index of the page that should be selected in the option menu
        if 'menu_option' not in st.session_state:
            st.session_state['menu_option'] = 0

        #################################
        # Upload session states
        #################################

        # Type: JSON
        # Description: The uploaded json input file stored in session state
        if "json_uploaded_input" not in st.session_state:
            st.session_state.json_uploaded_input = {}

        # Type: Boolean
        # Description: Status on if the uploaded input parameters should be used
        if "upload" not in st.session_state:
            st.session_state.upload = None

        # Type: Boolean
        # Description: Status on if the uploaded input parameters should be cleared
        if "clear_upload" not in st.session_state:
            st.session_state.clear_upload = None

        ##########################################
        # Json session states that build the model
        ##########################################

        if "json_battmo_formatted_input" not in st.session_state:
            st.session_state.json_battmo_formatted_input = {}

        if "json_linked_data_input" not in st.session_state:
            st.session_state.json_linked_data_input = {}

        if "json_gui_calculated_quantities" not in st.session_state:
            st.session_state.json_gui_calculated_quantities = {}

        if "json_indicator_quantities" not in st.session_state:
            st.session_state.json_indicator_quantities = {}

        #################################
        # Build Cells session states
        #################################

        if "save_cell" not in st.session_state:
            st.session_state.save_cell = False

        if "cell_name" not in st.session_state:
            rand = np.random.rand()
            cell_name = "Cell_{}".format(rand)

            st.session_state.cell_name = cell_name

        #################################
        # Simulation session states
        #################################

        # Type: string
        # Description: a UUID in string format for the simulation to be executed
        if "simulation_uuid" not in st.session_state:
            st.session_state.simulation_uuid = None

        # Type: Boolean
        # Description: Status on if the gui connected correctly with the web socket API
        if "response" not in st.session_state:
            st.session_state.response = None

        # Type: float
        # Description: simulation progress received from the API
        if "simulation_progress" not in st.session_state:
            st.session_state.simulation_progress = 0

        # Type: Boolean
        # Description: Status on if the simulation has completed
        if "simulation_completed" not in st.session_state:
            st.session_state.simulation_completed = False

        # Type: HDF5
        # Description: The simulation results
        if "simulation_results" not in st.session_state:
            st.session_state.simulation_results = None

        # Type: Boolean
        # Description: Status on if the simulation was successful
        if "simulation_successful" not in st.session_state:
            st.session_state.simulation_successful = None

        # Type: string
        # Description: the name with which the hdf5 results file will be stored in the temporary folder
        if "simulation_results_file_name" not in st.session_state:
            st.session_state.simulation_results_file_name = None

        # Type: Boolean
        # Description: Status on if the simulation results can be transfered for analysis
        if "transfer_results" not in st.session_state:
            st.session_state.transfer_results = None

        # Type: Int
        # Description: Stores the number of states that are simulated
        if "number_of_states" not in st.session_state:
            st.session_state.number_of_states = None

        # Type: String
        # Description: Stores the log messages from the simulation
        if "log_messages" not in st.session_state:
            st.session_state.log_messages = None

        # Type: Boolean
        # Description: Status on if the user pushed the "Stop Simulation" button (Not implemented at the moment)
        if "stop_simulation" not in st.session_state:
            st.session_state.stop_simulation = None

        #################################
        # Results session states
        #################################

        if "hdf5_upload" not in st.session_state:
            st.session_state.hdf5_upload = None

        if "selected_data" not in st.session_state:
            st.session_state["selected_data"] = None
