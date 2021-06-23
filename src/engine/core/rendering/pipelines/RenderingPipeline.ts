export class RenderingPipeline {
    addPass() {

    }

    // https://docs.unity3d.com/Manual/GraphicsCommandBuffers.html

    // - Built-in Render Pipeline

    // DEFERRED
    //
    // GBuffer
    // Reflections
    // Lighting -> ShadowMapPass, ScreenSpaceMask
    // FinalPass

    // FORWARD
    //
    // DepthTexture
    // DepthNormalTexture
    // Lighting

    // ----------

    // ForwardOpaque
    // Skybox
    // ImageEffectsOpaque
    // ForwardAlpha (UI)
    // ImageEffects

    // - Events

    // BeforeGBuffer
    // AfterGBuffer
}