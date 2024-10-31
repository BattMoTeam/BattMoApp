import streamlit as st
import uuid
import tempfile


def init_session_states():

    #################################
    # General app session states
    #################################

    # Type: string
    # Description: The theme of the browser (light or dark)
    if "theme" not in st.session_state:
        st.session_state.theme = None

    # Type: string
    # Description: a UUID for the user session
    if "uuid_user_session" not in st.session_state:
        st.session_state["uuid_user_session"] = str(uuid.uuid4())

    # Type: string
    # Description: the path of the temporary directory created for each unique user session
    if "temporary_directory" not in st.session_state:
        unique_id = st.session_state["uuid_user_session"]
        temp_dir = tempfile.mkdtemp(prefix=f"session_{unique_id}_")
        st.session_state["temporary_directory"] = temp_dir

    #################################
    # Input upload session states
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

    #################################
    # Build model session states
    #################################

    # Type: Int
    # Description: The id of the model that is selected by the user
    if "selected_model" not in st.session_state:
        st.session_state.selected_model = None

    # Type: JSON
    # Description: The JSON linked data representation of the "Build model" page. Contains the parameters that represent the simulation model.
    if "json_linked_data_model" not in st.session_state:
        st.session_state.json_linked_data_model = {}

    #################################
    # Build geometry session states
    #################################

    # Type: Int
    # Description: The id of the cell type that is selected by the user
    if "selected_cell_type" not in st.session_state:
        st.session_state.selected_cell_type = None

    # Type: Int
    # Description: The id of the common cell design that is selected by the user
    if "selected_cell_design" not in st.session_state:
        st.session_state.selected_cell_design = None

    # Type: JSON
    # Description: The JSON linked data representation of the "Build geometry" page. Contains the parameters that represent the geometry simulation model.
    if "json_linked_data_geometry" not in st.session_state:
        st.session_state.json_linked_data_geometry = {}

    #################################
    # Fill geometry session states
    #################################

    # Type: JSON
    # Description: The values of the calculated quantities
    if "json_gui_calculated_quantities" not in st.session_state:
        st.session_state.json_gui_calculated_quantities = {}

    # Type: JSON
    # Description: The values of the indicator quantities
    if "json_indicator_quantities" not in st.session_state:
        st.session_state.json_indicator_quantities = {}

    # Type: JSON
    # Description: The JSON linked data representation of the "Fill geometry" page. Contains the parameters that represent the material simulation model.
    if "json_linked_data_material" not in st.session_state:
        st.session_state.json_linked_data_material = {}

    #################################
    # Protocol session states
    #################################

    # Type: JSON
    # Description: The JSON linked data representation of the "Protocol" page. Contains the parameters that represent the control simulation model.
    if "json_linked_data_protocol" not in st.session_state:
        st.session_state.json_linked_data_protocol = {}

    #################################
    # Simulation session states
    #################################

    # Type: JSON
    # Description: The JSON linked data representing th complete simulation model (all the sub-models combined).
    if "json_linked_data_input" not in st.session_state:
        st.session_state.json_linked_data_input = {}

    # Type: JSON
    # Description: all the simulation input parameters in BattMo format
    if "json_battmo_formatted_input" not in st.session_state:
        st.session_state.json_battmo_formatted_input = {}

    # Type: string
    # Description: a UUID in string format for the simulation to be executed
    if "simulation_uuid" not in st.session_state:
        st.session_state.simulation_uuid = None

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
