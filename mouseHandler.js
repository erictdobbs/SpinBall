var MouseHandler = (function () {
    function MouseHandler() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.oldMouseX = 0;
        this.oldMouseY = 0;
        this.isMouseLeftClicked = false;
        this.oldIsMouseLeftClicked = false;
        this.isMouseLeftChanged = false;
        this.isMouseRightClicked = false;
        this.oldIsMouseRightClicked = false;
        this.isMouseRightChanged = false;
        this.mouseDeltaX = 0;
        this.mouseDeltaY = 0;
        this.m_isMouseLeftClicked = false;
        this.m_isMouseRightClicked = false;
        this.m_mouseX = 0;
        this.m_mouseY = 0;
    }
    MouseHandler.prototype.onMouseDown = function (e) {
        if (e.button === undefined || e.button === 0) {
            mouseHandler.m_isMouseLeftClicked = true;
            mouseHandler.m_mouseX = e.pageX;
            mouseHandler.m_mouseY = e.pageY;
        }
        else if (e.button == 2) {
            mouseHandler.m_isMouseRightClicked = true;
            mouseHandler.m_mouseX = e.pageX;
            mouseHandler.m_mouseY = e.pageY;
        }
    };
    MouseHandler.prototype.onMouseUp = function (e) {
        if (e.button === undefined || e.button === 0) {
            mouseHandler.m_isMouseLeftClicked = false;
        }
        else if (e.button == 2) {
            mouseHandler.m_isMouseRightClicked = false;
        }
    };
    MouseHandler.prototype.onMouseMove = function (e) {
        var pageX = e.pageX;
        var pageY = e.pageY;
        var x = pageX;
        var y = pageY;
        mouseHandler.mouseDeltaX = x - mouseHandler.m_mouseX;
        mouseHandler.mouseDeltaY = y - mouseHandler.m_mouseY;
        mouseHandler.m_mouseX = x;
        mouseHandler.m_mouseY = y;
    };
    MouseHandler.prototype.UpdateMouseDelta = function () {
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
    };
    return MouseHandler;
}());
var mouseHandler = new MouseHandler();
//# sourceMappingURL=mouseHandler.js.map