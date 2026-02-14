# ViewModel structure
- List of Elements
- List of Edges
- UserState
  - Zoom
    - zoomValue
  - Pan
    - panX
    - panY
  - HighlightBox (can only be rectangle)
    - x
    - y
  - Cursor
    - x
    - y
  - SelectedColor
  - SelectedFont
- List of CustomObjects

# Type strucutres
## Drawable
- id
- x
- y
- height
- width
- type (examples: Shape, CustomObject, Group, Text, Annotation, Image, Frame)
- boundingBox (the rectangle that shows when you click an element)
- selectionBoundingBox (for when you want to select the shape)
- isVisible
- draw()

Note: Everything suffixed with "Drawable" will inherit from drawable

## EdgeDrawable
- type (example: arrow, relationship)

## ShapeDrawable
- type (example: square, rectangle, line, circle)
- color
- outlineWidth
- outlineColor
- draw()

## TextDrawable
- font
- color
- isMarkdown

## CustomObjectDrawable
- List of drawable keys and drawable values
- isDrawingAsTable

## CustomKeyDrawable
- keyId
- keyName (user readable key name)

## CustomValueDrawable
- valueId
- valueName (user readable valueName)
- valueType (text, number, date, image, link)