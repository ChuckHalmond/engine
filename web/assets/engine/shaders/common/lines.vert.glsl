#version 300 es

#define MAX_INSTANCES 2

in vec3 a_position;

uniform viewBlock {
    mat4 u_view;
    mat4 u_projection;
};

struct Model {
    mat4 u_model;
    mat4 u_modelView;
    mat4 u_normal;
};

uniform modelBlock {
    Model models[MAX_INSTANCES]; 
};

void main() {
    Model instanceModel = models[gl_InstanceID];
    mat4 modelView = instanceModel.u_modelView;
    vec4 vertPos = modelView * vec4(a_position, 1.0);
    /*
    Model instanceModel = models[gl_InstanceID];
    mat4 modelView = instanceModel.u_modelView;
    vec4 vertPos = modelView * vec4(a_position, 1.0);
    gl_Position = u_projection * vertPos;
    */
    gl_Position = u_projection * vertPos;
}