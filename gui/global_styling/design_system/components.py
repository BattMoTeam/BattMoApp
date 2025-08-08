from nicegui import ui
from global_styling.design_system.tokens import COLORS, BORDER_RADIUS

ui.colors(
    primary=COLORS["primary"],
    secondary=COLORS["secondary"],
)

def primary_button(text: str, on_click=None):
    return ui.button(text, on_click=on_click).style(
        f'background-color: primary; color: white; text-transform: none; border-radius: {BORDER_RADIUS};'
    )



