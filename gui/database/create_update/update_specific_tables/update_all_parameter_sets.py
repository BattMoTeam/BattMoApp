import os
import sys
import numpy as np

##############################
# Set page directory to base level to allow for module import from different folder
sys.path.insert(
    0,
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))),
)
##############################

from database import db_handler, db_helper
from app_scripts import app_access


#####################################
#    UPDATE PARAMETER SET
#####################################
class Parameter(object):
    def __init__(
        self,
        name,
        display_name,
        parameter_set_id,
        template_parameter_id,
        value=None,
    ):
        self.name = name
        self.parameter_set_id = parameter_set_id
        self.template_parameter_id = template_parameter_id
        self.value = value
        self.display_name = display_name


class UpdateParameterSets:

    def __init__(self, print_details=False):
        self.sql_parameter = db_handler.ParameterHandler()
        self.sql_parameter_set = db_handler.ParameterSetHandler()
        self.sql_category = db_handler.CategoryHandler()
        self.sql_template_parameter = db_handler.TemplateParameterHandler()

        self.print_details = print_details

    def get_all_resources(self):
        return app_access.get_all_parameter_sets()

    def update_parameter_set_from_json(self, parameter_set, path, category=None):

        # Get json details
        name = parameter_set.get("name")
        category = parameter_set.get("category")
        parameters = parameter_set.get("parameters")

        assert name is not None, "Name of parameter_set {} must have a name".format(path)
        assert parameters is not None, "Parameters of parameter_set {} is not defined".format(name)

        category_id = self.sql_category.get_id_from_name(category)

        parameter_set_id, parameter_set_already_exists = self.create_or_update_parameter_set(
            name=name, category_id=category_id
        )

        formatted_parameters = self.format_parameters(
            parameters=parameters, parameter_set_id=parameter_set_id
        )

        if parameter_set_already_exists:
            if self.print_details:
                print("\n Updating {}".format(name))
            self.update_parameters(parameters=formatted_parameters)

        else:
            if self.print_details:
                print("\n Creating {}".format(name))
            self.add_parameters(parameters=formatted_parameters)

        return parameter_set_id, parameter_set_already_exists, name

    def create_or_update_parameter_set(self, name, category_id):

        parameter_set_id = self.sql_parameter_set.get_id_from_name(name)

        if parameter_set_id:
            return parameter_set_id, True
        else:
            return (
                self.sql_parameter_set.insert_value(name=name, category_id=category_id),
                False,
            )

    def format_parameters(self, parameters, parameter_set_id):

        formatted_parameters = []
        for parameter_name in parameters:

            template_parameter_id = self.sql_template_parameter.get_id_from_name(parameter_name)

            if template_parameter_id is None:
                assert "Warning !! parameter {} has no corresponding template parameter".format(
                    parameter_name
                )
                formatted_value = None

            else:
                template_parameter_dict = self.sql_template_parameter.get_all_from_id(
                    template_parameter_id
                )
                template_parameter_type = template_parameter_dict["type"]
                display_name = template_parameter_dict["display_name"]
                value = parameters.get(parameter_name)
                value_type = template_parameter_type
                formatted_value = self.format_value(value, value_type)

            if formatted_value:

                formatted_parameters.append(
                    Parameter(
                        name=parameter_name,
                        parameter_set_id=parameter_set_id,
                        template_parameter_id=template_parameter_id,
                        value=formatted_value,
                        display_name=display_name,
                    )
                )

        return formatted_parameters

    def format_value(self, value, value_type):
        """
        Values are stored as string: if it's already a string, str(value) will fail
        """
        if value is None:
            return None

        elif value_type == "str":
            return value

        else:
            return str(value)

    def add_parameters(self, parameters):
        added_parameters = []
        for parameter in parameters:
            print(parameter.display_name)
            self.sql_parameter.insert_value(
                name=parameter.name,
                display_name=parameter.display_name,
                parameter_set_id=parameter.parameter_set_id,
                template_parameter_id=parameter.template_parameter_id,
                value=parameter.value,
            )
            added_parameters.append(parameter.name)

        if self.print_details:
            print("  Added parameters: ", added_parameters)

    def update_parameters(self, parameters):
        if not parameters:
            return
        parameter_set_id = parameters[0].parameter_set_id
        new_parameters = []
        # every item which is not updated will be deleted, so we don't keep useless items in db
        existing_ids_to_be_deleted = self.sql_parameter.get_all_ids_by_parameter_set_id(
            parameter_set_id
        )

        for parameter in parameters:
            parameter_id = self.sql_parameter.get_id_from_name_and_parameter_set_id(
                name=parameter.name, parameter_set_id=parameter_set_id
            )
            if parameter_id:  # existing parameter, update fields
                try:
                    self.sql_parameter.update_by_id(
                        id=parameter_id,
                        columns_and_values={
                            "name": parameter.name,
                            "display_name": parameter.display_name,
                            "parameter_set_id": parameter.parameter_set_id,
                            "template_parameter_id": parameter.template_parameter_id,
                            "value": parameter.value,
                        },
                    )
                    existing_ids_to_be_deleted.remove(parameter_id)
                except:
                    # SQL query in update_by_id could fail, for example for str containing quotes
                    # In that case, we delete and recreate the parameter instead of updating it
                    new_parameters.append(parameter)

            else:  # non-existing parameter, create it
                new_parameters.append(parameter)

        # add new params and delete unused ones
        self.add_parameters(new_parameters)

        deleted_parameters = []
        for id_to_delete in existing_ids_to_be_deleted:
            deleted_parameters.append(self.sql_parameter.get_name_from_id(id_to_delete))
            self.sql_parameter.delete_by_id(id_to_delete)

        if self.print_details:
            print("  Deleted parameters: ", deleted_parameters)

    #####################################
    #    DELETE PARAMETER SET
    #####################################
    def delete_parameter_set_by_id(self, parameter_set_id):
        parameter_set = self.sql_parameter_set.select_by_id(parameter_set_id)
        if parameter_set:
            _, name, component_id, _, _ = parameter_set
            component_id = int(component_id)
            parameter_ids = self.sql_parameter.get_all_ids_by_parameter_set_id(parameter_set_id)

            self.sql_parameter_set.delete_by_id(parameter_set_id)
            for parameter_id in parameter_ids:
                self.sql_parameter.delete_by_id(parameter_id)
            print(
                "\n Parameter_set(name = {}, type={}) has been deleted.".format(
                    name, self.sql_component.get_name_from_id(component_id)
                )
            )
            return name

    #####################################
    #    RUN SCRIPT
    #####################################

    def execute_script(self):
        all_file_path = self.get_all_resources()
        existing_ids_to_be_deleted = self.sql_parameter_set.get_all_ids()

        new_or_updated = []
        deleted = []

        for file_path in all_file_path:
            file_as_json = app_access.get_json_from_path(file_path)

            parameter_set_id, parameter_set_already_exists, name = (
                self.update_parameter_set_from_json(file_as_json, file_path)
            )
            new_or_updated.append(name)

            if parameter_set_already_exists and existing_ids_to_be_deleted:
                existing_ids_to_be_deleted.remove(parameter_set_id)

        if existing_ids_to_be_deleted:
            for id_to_be_deleted in existing_ids_to_be_deleted:
                deleted.append(self.delete_parameter_set_by_id(id_to_be_deleted))

            print(
                "\n SQL tables parameter and parameter_set are up to date according to the templates resource files"
            )
            if new_or_updated:
                print(" Created or updated parameter_set : ", new_or_updated)
            if deleted:
                print(" Deleted parameter_set: ", deleted)


if __name__ == "__main__":
    UpdateParameterSets(print_details=True).execute_script()
