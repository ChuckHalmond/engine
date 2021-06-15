export { TooltipAttributeExtension };

const statusBarMouseenterListenerKey = '__statusBarMouseenterListener';
const statusBarMouseleaveListenerKey = '__statusBarMouseleaveListener';

const TooltipAttributeExtension = {

    attributeName: 'tooltip',

    enable: function(element: HTMLElement) {
        const tooltip = element.getAttribute(TooltipAttributeExtension.attributeName);
        
        const colliderId = element.getAttribute('tooltip-collider');
        
        const collider = document.getElementById(`#${colliderId}`) || element;

        if (tooltip) {
            const mouseenterListener = () => {
                if (TooltipAttributeExtension.__statusBar) {
                    TooltipAttributeExtension.__statusBar.innerHTML = tooltip;
                }
            };
            const mouseleaveListener = () => {
                if (TooltipAttributeExtension.__statusBar) {
                    TooltipAttributeExtension.__statusBar.innerHTML = '';
                }
            };
            collider.addEventListener('mouseenter', mouseenterListener, {capture: true});
            collider.addEventListener('mouseleave', mouseleaveListener, {capture: true});
            Object.assign(element, {
                [statusBarMouseenterListenerKey]: mouseenterListener,
                [statusBarMouseleaveListenerKey]: mouseleaveListener
            });
        }
    },
    
    disable: function(element: HTMLElement & {
        [statusBarMouseenterListenerKey]?: (...args: any) => any,
        [statusBarMouseleaveListenerKey]?: (...args: any) => any
    }, collider: HTMLElement) {
        element.removeAttribute(TooltipAttributeExtension.attributeName);

        if (typeof element[statusBarMouseenterListenerKey] !== 'undefined') {
            collider.removeEventListener('mouseenter', element[statusBarMouseenterListenerKey]!);
        }
        if (typeof element[statusBarMouseleaveListenerKey] !== 'undefined') {
            collider.removeEventListener('mouseleave', element[statusBarMouseleaveListenerKey]!);
        }
    },

    setStatusBar(statusBar: HTMLElement): void {
        TooltipAttributeExtension.__statusBar = statusBar;
    },
    
    __statusBar: null as HTMLElement | null
};