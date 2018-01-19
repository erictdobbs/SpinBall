class MouseHandler {

    mouseX: number = 0;
    mouseY: number = 0;
    oldMouseX: number = 0;
    oldMouseY: number = 0;

    isMouseLeftClicked: boolean = false;
    oldIsMouseLeftClicked: boolean = false; 
    isMouseLeftChanged: boolean = false;
    isMouseRightClicked: boolean = false;
    oldIsMouseRightClicked: boolean = false; 
    isMouseRightChanged: boolean = false;

    mouseDeltaX: number = 0;
    mouseDeltaY: number = 0;

    m_isMouseLeftClicked: boolean = false;
    m_isMouseRightClicked: boolean = false;
    private m_mouseX: number = 0;
    private m_mouseY: number = 0;

    onMouseDown(e: MouseEvent): void {
        if (e.button === undefined || e.button === 0) {
            mouseHandler.m_isMouseLeftClicked = true;
            mouseHandler.m_mouseX = e.pageX;
            mouseHandler.m_mouseY = e.pageY;
        } else if (e.button == 2) {
            mouseHandler.m_isMouseRightClicked = true;
            mouseHandler.m_mouseX = e.pageX;
            mouseHandler.m_mouseY = e.pageY;
        }
    }

    onMouseUp(e: MouseEvent) {
        if (e.button === undefined || e.button === 0) {
            mouseHandler.m_isMouseLeftClicked = false;
        }else if (e.button == 2) {
            mouseHandler.m_isMouseRightClicked = false;
        }
    }
    
    onMouseMove(e: MouseEvent) {
        var pageX = e.pageX;
        var pageY = e.pageY;
       
        var x = pageX;
        var y = pageY;

        mouseHandler.mouseDeltaX = x - mouseHandler.m_mouseX;
        mouseHandler.mouseDeltaY = y - mouseHandler.m_mouseY;

        mouseHandler.m_mouseX = x;
        mouseHandler.m_mouseY = y;
    }

    UpdateMouseDelta() {
        mouseHandler.mouseX = mouseHandler.m_mouseX;
        mouseHandler.mouseY = mouseHandler.m_mouseY;
        
        mouseHandler.isMouseLeftClicked = mouseHandler.m_isMouseLeftClicked;
        mouseHandler.isMouseRightClicked = mouseHandler.m_isMouseRightClicked;

        mouseHandler.mouseDeltaX = mouseHandler.mouseX - mouseHandler.oldMouseX;
        mouseHandler.mouseDeltaY = mouseHandler.mouseY - mouseHandler.oldMouseY;

        mouseHandler.oldMouseX = mouseHandler.mouseX;
        mouseHandler.oldMouseY = mouseHandler.mouseY;
        mouseHandler.isMouseLeftChanged = (mouseHandler.oldIsMouseLeftClicked != mouseHandler.isMouseLeftClicked);
        mouseHandler.oldIsMouseLeftClicked = mouseHandler.isMouseLeftClicked;
        mouseHandler.isMouseRightChanged = (mouseHandler.oldIsMouseRightClicked != mouseHandler.isMouseRightClicked);
        mouseHandler.oldIsMouseRightClicked = mouseHandler.isMouseRightClicked;
    }
}
var mouseHandler = new MouseHandler();