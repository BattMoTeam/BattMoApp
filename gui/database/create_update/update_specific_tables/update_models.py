import os
import sys

##############################
# Set page directory to base level to allow for module import from different folder
sys.path.insert(
    0,
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))),
)
##############################

from database import db_handler
from app_scripts import app_access


class UpdateModels:

    def __init__(self):
        self.sql_model = db_handler.ModelHandler()
        self.sql_category = db_handler.CategoryHandler()

    def get_resource_as_json(self):
        return app_access.get_json_from_path(app_access.get_path_to_models())

    def update_model_from_json(self, resource_file):

        models = resource_file.get("models")
        assert models is not None, "This input format is not handled"

        new_types = []
        updated_types = []

        # every item which is not updated will be deleted, so we don't keep useless items in db
        existing_ids_to_be_deleted = self.sql_model.get_all_ids()

        for model_name in models:
            details = models.get(model_name)

            # Get column values
            display_name = details.get("display_name")
            context_type = details.get("context_type")
            context_type_iri = details.get("context_type_iri")
            is_shown_to_user = int(details.get("is_shown_to_user"))
            description = details.get("description")
            category = details.get("category")

            category_id = self.sql_category.get_id_from_name(category)
            model_id = self.sql_model.get_id_from_name(model_name)

            if model_id:  # existing type
                self.sql_model.update_by_id(
                    id=model_id,
                    columns_and_values={
                        "display_name": display_name,
                        "category_id": category_id,
                        "context_type": context_type,
                        "context_type_iri": context_type_iri,
                        "is_shown_to_user": is_shown_to_user,
                        "description": description,
                    },
                )
                updated_types.append(model_name)

                existing_ids_to_be_deleted.remove(model_id)

            else:  # non-existing type, create it
                model_id = self.sql_model.insert_value(
                    name=model_name,
                    display_name=display_name,
                    category_id=category_id,
                    context_type=context_type,
                    context_type_iri=context_type_iri,
                    is_shown_to_user=is_shown_to_user,
                    description=description,
                )
                new_types.append(model_name)

            # self.create_or_update_parameters(model_id, parameters)

        # Delete unused models which remain in the sql table
        deleted_types = []
        if existing_ids_to_be_deleted:
            for id_to_delete in existing_ids_to_be_deleted:
                deleted_types.append(self.sql_model.get_name_from_id(id_to_delete))
                self.sql_model.delete_by_id(id_to_delete)
                # self.create_or_update_parameters(id_to_delete, {})  # trick to delete corresponding parameters

        print(
            "\n SQL tables model and model_parameters are up to date according to the resource file models.json"
        )
        if updated_types:
            print(" Updated models : ", updated_types)
        if new_types:
            print(" New models: ", new_types)
        if deleted_types:
            print(" Deleted models: ", deleted_types)

    def execute_script(self):
        return self.update_model_from_json(self.get_resource_as_json())


if __name__ == "__main__":
    UpdateModels().execute_script()
