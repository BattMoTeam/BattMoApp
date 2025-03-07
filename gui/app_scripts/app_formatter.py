import sys
import os


##############################
# Set page directory to base level to allow for module import from different folder
path_to_streamlit_module = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, path_to_streamlit_module)
##############################

from app_objects import *


class FormatParameters:

    def __init__(self):
        self.type_function = "function"
        self.user_defined_id = 0

    def get_index(self, list, id):

        for list_index, value in enumerate(list):
            if value == id:
                index = list_index
                break

        assert index is not None, "id={} not found in list".format(id)
        return index

    def set_format(_self, value):
        if isinstance(value, int):
            format = "%d"

        else:
            max_readable_value = 10000
            min_readable_value = 0.001
            is_readable = value < max_readable_value and value > min_readable_value
            format = "%g" if is_readable else "%.2e"
        return format

    def set_increment(_self, value):
        """
        Calculates increment from min and max values.
        Increment is used to define the number input widget.
        """
        if isinstance(value, float):
            if value == 0:
                # Dynamic minimum increment for zero
                increment = 1e-14
                return increment

            # Calculate order of magnitude
            order_of_magnitude = math.floor(math.log10(abs(value)))

            # Base increment as power of 10
            base_increment = 10**order_of_magnitude

            # Adjust increment for user-friendliness
            if value < 1:
                increment = base_increment / 10
            else:
                increment = base_increment / 2

            # Further refinement for very small values
            increment = max(increment, 1e-14)  # Set minimum threshold to 1e-14

            return float(increment)

        # Default increment for integers or non-float values
        return 1

    def format_parameters(self, parameters, template_parameters):

        initialized_template_parameters = self.initialize_template_parameter_object(
            template_parameters
        )

        formatted_parameters = self.add_parameter_option_to_object(
            parameters, initialized_template_parameters
        )

        return formatted_parameters

    def add_parameter_option_to_object(self, parameters, formatted_parameters):

        for parameter in parameters:
            parameter_id = parameter["id"]
            name = parameter["name"]
            parameter_set_id = parameter["parameter_set_id"]
            value = parameter["value"]

            template_parameter = formatted_parameters[name]

            if template_parameter:
                if isinstance(template_parameter, NumericalParameter):
                    if template_parameter.type == "int":
                        formatted_value = int(value)
                    elif template_parameter.type == "float":
                        formatted_value = float(value)
                        # formatted_value = self.custom_number_input(formatted_value)
                    else:
                        assert (
                            False
                        ), "Unexpected NumericalParameter. parameter_id={} type={}".format(
                            parameter_id, template_parameter.type
                        )
                elif isinstance(template_parameter, StrParameter):
                    formatted_value = value
                elif isinstance(template_parameter, BooleanParameter):
                    formatted_value = bool(value)
                elif isinstance(template_parameter, FunctionParameter):
                    formatted_value = eval(value)
                    template_parameter.set_selected_value(formatted_value)
                else:

                    assert False, "Unexpected template_parameter. parameter_id={}".format(
                        parameter_id
                    )

                parameter_display_name = template_parameter.display_name

                # each parameter has metadata from the "template", to which we add the options containing value and origin

                new_option = Option_parameter(
                    formatted_value=formatted_value,
                    parameter_set_id=parameter_set_id,
                    parameter_display_name=parameter_display_name,
                    parameter_name=name,
                )

                template_parameter.add_option(parameter_id, new_option)
            else:

                assert (
                    False
                ), "Parameter {} has no matching template_parameter. parameter_id={}".format(
                    name, parameter_id
                )
        return formatted_parameters

    def initialize_template_parameter_object(self, template_parameters):

        initialized_template_parameters = {}

        for template_parameter in template_parameters:

            template_parameter_id = template_parameter["id"]
            name = template_parameter["name"]
            display_name = template_parameter["display_name"]
            context_type = template_parameter["context_type"]
            context_type_iri = template_parameter["context_type_iri"]
            parameter_type = template_parameter["type"]
            unit = template_parameter["unit"]
            unit_name = template_parameter["unit_name"]
            unit_iri = template_parameter["unit_iri"]
            max_value = template_parameter["max_value"]
            min_value = template_parameter["min_value"]
            description = template_parameter["description"]

            if parameter_type in [int.__name__, float.__name__]:
                initialized_template_parameters[name] = NumericalParameter(
                    id=template_parameter_id,
                    name=name,
                    context_type=context_type,
                    context_type_iri=context_type_iri,
                    type=parameter_type,
                    description=description,
                    min_value=min_value,
                    max_value=max_value,
                    unit=unit,
                    unit_name=unit_name,
                    unit_iri=unit_iri,
                    display_name=display_name,
                )

            elif parameter_type == bool.__name__:
                initialized_template_parameters[name] = BooleanParameter(
                    id=template_parameter_id,
                    name=name,
                    context_type=context_type,
                    context_type_iri=context_type_iri,
                    type=parameter_type,
                    description=description,
                    display_name=display_name,
                )

            elif parameter_type == str.__name__:
                initialized_template_parameters[name] = StrParameter(
                    id=template_parameter_id,
                    name=name,
                    context_type=context_type,
                    context_type_iri=context_type_iri,
                    type=parameter_type,
                    description=description,
                    display_name=display_name,
                )

            elif parameter_type == self.type_function:
                # function parameters should be changed, using a more robust way to define them.
                # for now functions are defined as string (ex: computeOCP_nmc111)
                initialized_template_parameters[name] = FunctionParameter(
                    id=template_parameter_id,
                    name=name,
                    context_type=context_type,
                    context_type_iri=context_type_iri,
                    description=description,
                    unit=unit,
                    unit_name=unit_name,
                    unit_iri=unit_iri,
                    display_name=display_name,
                )

            else:
                assert False, "parameter_type={} is not handled. parameter_id={}".format(
                    parameter_type, template_parameter_id
                )

        return initialized_template_parameters
