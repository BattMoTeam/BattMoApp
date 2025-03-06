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


class UpdateCategories:

    def __init__(self):
        self.sql_category = db_handler.CategoryHandler()

    def get_resource_as_json(self):
        return app_access.get_json_from_path(app_access.get_path_to_categories())

    def update_category_from_json(self, resource_file):

        categories = resource_file.get("categories")
        assert categories is not None, "This input format is not handled"

        new_types = []
        updated_types = []

        # every item which is not updated will be deleted, so we don't keep useless items in db
        existing_ids_to_be_deleted = self.sql_category.get_all_ids()

        for category_name in categories:
            details = categories.get(category_name)

            # Get the column values
            display_name = details.get("display_name")
            context_type = details.get("context_type")
            context_type_iri = details.get("context_type_iri")
            description = details.get("description")

            category_id = self.sql_category.get_id_from_name(category_name)

            if category_id:  # existing type

                self.sql_category.update_by_id(
                    id=category_id,
                    columns_and_values={
                        "context_type": context_type,
                        "context_type_iri": context_type_iri,
                        "display_name": display_name,
                        "description": description,
                    },
                )

                updated_types.append(category_name)
                if existing_ids_to_be_deleted:
                    existing_ids_to_be_deleted.remove(category_id)

            else:  # non-existing type, create it
                self.sql_category.insert_value(
                    name=category_name,
                    context_type=context_type,
                    context_type_iri=context_type_iri,
                    display_name=display_name,
                    description=description,
                )
                new_types.append(category_name)

        # Delete unused types which remain in the sql table
        deleted_types = []
        if existing_ids_to_be_deleted:
            for id_to_delete in existing_ids_to_be_deleted:
                deleted_types.append(self.sql_category.get_name_from_id(id_to_delete))
                self.sql_category.delete_by_id(id_to_delete)

            print(
                "\n SQL table category is up to date according to the resource file categories.json"
            )
            if updated_types:
                print(" Updated categories : ", updated_types)
            if new_types:
                print(" New categories: ", new_types)
            if deleted_types:
                print(" Deleted categories: ", deleted_types)

    def execute_script(self):
        return self.update_category_from_json(self.get_resource_as_json())


if __name__ == "__main__":
    UpdateCategories().execute_script()
