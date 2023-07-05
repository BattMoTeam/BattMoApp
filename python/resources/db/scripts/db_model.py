from python.resources.db import db_access
"""
Important links between tables:

- a template has template_parameters
- a parameter has parameters
- a parameter refers to a template_parameter (which contains its metadata)

- a category pertains to a tab
- a category has an assigned default template

- a model can have custom templates for each category; if not, default template is used
- a model has model_parameters

"""

if __name__ == "__main__":
    con, cur = db_access.get_sqlite_con_and_cur()

    ########################################################
    #       parameter
    #       name, parameter_set_id, template_parameter_id, value
    ########################################################
    cur.execute("""
        CREATE TABLE IF NOT EXISTS parameter(
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(255) NOT NULL,
            parameter_set_id INT NOT NULL,
            template_parameter_id INT NOT NULL,
            value VARCHAR(255) DEFAULT NULL
        )
    """)

    ########################################################
    #       parameter_set
    #       name, category_id
    ########################################################
    cur.execute("""
        CREATE TABLE IF NOT EXISTS parameter_set(
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(40) NOT NULL,
            category_id INT NOT NULL
        )
    """)

    ########################################################
    #       template
    #       name
    ########################################################
    cur.execute("""
        CREATE TABLE IF NOT EXISTS template(
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(255) NOT NULL
        )
    """)

    ########################################################
    #       template_parameter
    #       name, template_id, context_type, context_type_iri, type, unit, unit_name, unit_iri, max_value, min_value, is_shown_to_user, description
    ########################################################
    cur.execute("""
        CREATE TABLE IF NOT EXISTS template_parameter(
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(255) NOT NULL,
            template_id INT NOT NULL,
            context_type VARCHAR(40) DEFAULT NULL,
            context_type_iri VARCHAR(40) DEFAULT NULL,
            type VARCHAR(40) DEFAULT NULL,
            unit VARCHAR(40) DEFAULT NULL,
            unit_name VARCHAR(40) DEFAULT NULL,
            unit_iri VARCHAR(40) DEFAULT NULL,
            max_value VARCHAR(255) DEFAULT NULL,
            min_value VARCHAR(255) DEFAULT NULL,
            is_shown_to_user TINYINT NOT NULL DEFAULT 1,
            description VARCHAR(255) NULL DEFAULT ""
        )
    """)

    ########################################################
    #       model
    #       name, templates, description
    ########################################################
    cur.execute("""
        CREATE TABLE IF NOT EXISTS model(
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(40) NOT NULL,
            templates VARCHAR(255) NULL DEFAULT "{}",
            description VARCHAR(255) NULL DEFAULT ""
        )
    """)

    ########################################################
    #       model_parameter
    #       name, model_id, value, type, unit, unit_name, unit_iri, description
    ########################################################
    cur.execute("""
        CREATE TABLE IF NOT EXISTS model_parameter(
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(255) NOT NULL,
            model_id INT NOT NULL,
            value VARCHAR(255) DEFAULT NULL,
            type VARCHAR(40) DEFAULT NULL,
            unit VARCHAR(40) DEFAULT NULL,
            unit_name VARCHAR(40) DEFAULT NULL,
            unit_iri VARCHAR(40) DEFAULT NULL,
            description VARCHAR(255) NULL DEFAULT ""
        )
    """)

    ########################################################
    #       tab
    #       name, display_name, context_type, context_type_iri, description
    ########################################################
    cur.execute("""
        CREATE TABLE IF NOT EXISTS tab(
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(40) NOT NULL,
            display_name VARCHAR(40) NOT NULL,
            context_type VARCHAR(40) DEFAULT NULL,
            context_type_iri VARCHAR(40) DEFAULT NULL,
            description VARCHAR(255) NULL DEFAULT ""
        )
    """)

    ########################################################
    #       category
    #       name, context_type, context_type_iri, emmo_relation, display_name, tab_id, default_template_id, description
    ########################################################
    cur.execute("""
        CREATE TABLE IF NOT EXISTS category(
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(40) NOT NULL,
            context_type VARCHAR(40) DEFAULT NULL,
            context_type_iri VARCHAR(40) DEFAULT NULL,
            emmo_relation VARCHAR(40) DEFAULT NULL,
            display_name VARCHAR(40) NOT NULL DEFAULT " ",
            tab_id INT NOT NULL,
            default_template_id INT NOT NULL,
            description VARCHAR(255) NULL DEFAULT ""
        )
    """)
