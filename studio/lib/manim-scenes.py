#!/usr/bin/env python3
"""
Like One Studio — Manim Scene Library
Generates educational diagrams as transparent video overlays.
Called by compose pipeline via subprocess.

Usage:
  python3 manim-scenes.py neuron-diagram output_dir/ 8.0
  python3 manim-scenes.py layer-stack output_dir/ 10.0
  python3 manim-scenes.py network-emergence output_dir/ 12.0

Outputs: {output_dir}/{scene_name}.mp4 (transparent-bg video)
"""
import sys
import os

# Ensure manim is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '.venv', 'lib'))

from manim import *

# Visual Bible V2 Design Tokens — synced with design-tokens.js
# Foundations
VOID = "#0B0A10"        # Deep aubergine-black
CHALK = "#F0EBE3"       # Bone white
SMOKE = "#8A8490"       # Mauve gray
ASH = "#2D2A33"         # Warm charcoal
# Semantic (meaning-driven colors)
SIGNAL = "#D4956B"      # Terracotta — input/data/human element
PROCESS = "#8BAFC4"     # Dusty blue — transformation/thinking
RESULT = "#8CB89E"      # Sage — output/growth
ALERT = "#C4616A"       # Muted rose — attention
INSIGHT = "#B898C8"     # Wisteria — aha/sublime
# McQueen accents
BONE = "#E8DDD0"        # Skeletal elegance
GOLD = "#C4A86C"        # Earned warmth


class NeuronDiagram(Scene):
    """Animated artificial neuron: inputs → weights → sum → activation → output.
    Matches the explain-neuron scene overlay description."""

    def construct(self):
        dur = float(self.duration) if hasattr(self, 'duration') else 8.0
        self.camera.background_color = VOID

        # Input nodes (left side) — SIGNAL = input/data
        inputs = VGroup()
        input_labels = ["x₁", "x₂", "x₃"]
        for i, label in enumerate(input_labels):
            circle = Circle(radius=0.3, color=SIGNAL, stroke_width=2)
            circle.move_to(LEFT * 4.5 + UP * (1 - i) * 1.2)
            text = Text(label, font_size=20, color=CHALK).move_to(circle)
            inputs.add(VGroup(circle, text))

        # Weight labels on connections
        weights = VGroup()
        weight_labels = ["w₁", "w₂", "w₃"]

        # Summation node (center) — PROCESS = transformation
        sigma = Circle(radius=0.5, color=PROCESS, stroke_width=3)
        sigma.move_to(LEFT * 1.5)
        sigma_text = Text("Σ", font_size=36, color=CHALK).move_to(sigma)
        sigma_group = VGroup(sigma, sigma_text)

        # Connections: inputs → sigma
        arrows_in = VGroup()
        for i, inp in enumerate(inputs):
            arrow = Arrow(
                inp[0].get_right(), sigma.get_left(),
                color=SIGNAL, stroke_width=1.5, buff=0.1,
                max_tip_length_to_length_ratio=0.1
            )
            arrows_in.add(arrow)
            # Weight label on arrow
            w_label = Text(weight_labels[i], font_size=16, color=GOLD)
            w_label.move_to(arrow.get_center() + UP * 0.25)
            weights.add(w_label)

        # Activation function node — ALERT = attention/decision
        activation = RoundedRectangle(
            width=1.2, height=0.8, corner_radius=0.15,
            color=ALERT, stroke_width=2
        ).move_to(RIGHT * 1.5)
        act_text = Text("f(x)", font_size=20, color=CHALK).move_to(activation)
        act_group = VGroup(activation, act_text)

        # Arrow: sigma → activation
        arrow_mid = Arrow(
            sigma.get_right(), activation.get_left(),
            color=PROCESS, stroke_width=2, buff=0.1,
            max_tip_length_to_length_ratio=0.1
        )

        # Output node — RESULT = output/growth
        output = Circle(radius=0.3, color=RESULT, stroke_width=3)
        output.move_to(RIGHT * 4.5)
        out_text = Text("output", font_size=16, color=CHALK).move_to(output)
        out_group = VGroup(output, out_text)

        # Arrow: activation → output
        arrow_out = Arrow(
            activation.get_right(), output.get_left(),
            color=RESULT, stroke_width=2, buff=0.1,
            max_tip_length_to_length_ratio=0.1
        )

        # Flow labels
        label_multiply = Text("multiply", font_size=14, color=GOLD).next_to(arrows_in[1], DOWN, buff=0.6)
        label_sum = Text("sum up", font_size=14, color=PROCESS).next_to(sigma, DOWN, buff=0.3)
        label_decide = Text("fire or\nstay quiet", font_size=14, color=ALERT).next_to(activation, DOWN, buff=0.3)

        # Animation sequence — build left to right (matching screenplay direction)
        phase = dur / 5

        # Phase 1: Inputs appear
        self.play(
            *[FadeIn(inp, shift=LEFT * 0.3) for inp in inputs],
            run_time=phase * 0.8
        )

        # Phase 2: Connections + weights flow in
        self.play(
            *[GrowArrow(a) for a in arrows_in],
            run_time=phase * 0.6
        )
        self.play(
            *[FadeIn(w, shift=UP * 0.2) for w in weights],
            FadeIn(label_multiply, shift=UP * 0.1),
            run_time=phase * 0.5
        )

        # Phase 3: Summation appears
        self.play(
            FadeIn(sigma_group, scale=0.7),
            FadeIn(label_sum, shift=UP * 0.1),
            run_time=phase * 0.6
        )

        # Phase 4: Activation function
        self.play(
            GrowArrow(arrow_mid),
            run_time=phase * 0.4
        )
        self.play(
            FadeIn(act_group, scale=0.8),
            FadeIn(label_decide, shift=UP * 0.1),
            run_time=phase * 0.5
        )

        # Phase 5: Output
        self.play(
            GrowArrow(arrow_out),
            FadeIn(out_group, scale=0.7),
            run_time=phase * 0.5
        )

        # Hold for remaining time
        remaining = max(0.5, dur - self.renderer.time)
        self.wait(remaining)


class LayerStack(Scene):
    """One neuron → thousands → layers → intelligence.
    Matches the build-layers scene."""

    def construct(self):
        dur = float(self.duration) if hasattr(self, 'duration') else 10.0
        self.camera.background_color = VOID

        # Proportional timing: 5 phases that scale to requested duration
        phase = dur / 5

        # Phase 1: Single node
        single = Circle(radius=0.15, color=SIGNAL, fill_opacity=0.6, stroke_width=1)
        single_label = Text("One neuron", font_size=20, color=CHALK).next_to(single, DOWN, buff=0.3)

        self.play(FadeIn(single, scale=0.5), FadeIn(single_label), run_time=phase * 0.6)
        self.wait(phase * 0.3)

        # Phase 2: Multiply into a row
        self.play(FadeOut(single_label), run_time=phase * 0.2)
        row = VGroup(*[
            Circle(radius=0.1, color=SIGNAL, fill_opacity=0.5, stroke_width=1)
            for _ in range(12)
        ]).arrange(RIGHT, buff=0.15)

        self.play(
            Transform(single, row[6]),
            *[FadeIn(n, scale=0.3) for i, n in enumerate(row) if i != 6],
            run_time=phase * 0.8
        )

        row_label = Text("Thousands", font_size=20, color=GOLD).next_to(row, DOWN, buff=0.3)  # gold = earned warmth
        self.play(FadeIn(row_label), run_time=phase * 0.3)
        self.wait(phase * 0.2)

        # Phase 3: Stack into layers
        self.play(FadeOut(row_label), FadeOut(single), run_time=phase * 0.2)
        layers = VGroup()
        layer_colors = [SIGNAL, PROCESS, INSIGHT, RESULT]  # semantic: input → process → aha → output
        for i in range(4):
            layer = VGroup(*[
                Circle(radius=0.08, color=layer_colors[i], fill_opacity=0.5, stroke_width=1)
                for _ in range(10)
            ]).arrange(RIGHT, buff=0.12)
            layer.move_to(UP * (1.2 - i * 0.8))
            layers.add(layer)

        self.play(
            *[TransformFromCopy(row[j], layers[0][j]) for j in range(min(10, len(row)))],
            run_time=phase * 0.5
        )
        for i in range(1, 4):
            self.play(
                *[FadeIn(n, shift=DOWN * 0.2) for n in layers[i]],
                run_time=phase * 0.3
            )

        # Connections between layers
        connections = VGroup()
        for i in range(3):
            for n1 in layers[i][::3]:  # every 3rd node
                for n2 in layers[i + 1][::3]:
                    line = Line(
                        n1.get_bottom(), n2.get_top(),
                        stroke_width=0.5, color=BONE, stroke_opacity=0.2
                    )
                    connections.add(line)

        self.play(FadeIn(connections, lag_ratio=0.02), run_time=phase * 0.5)

        # Labels
        layer_names = ["Edges", "Shapes", "Faces", "Intelligence"]
        labels = VGroup()
        for i, name in enumerate(layer_names):
            l = Text(name, font_size=16, color=CHALK).next_to(layers[i], RIGHT, buff=0.4)
            labels.add(l)

        self.play(*[FadeIn(l, shift=RIGHT * 0.2) for l in labels], run_time=phase * 0.4)

        remaining = max(0.5, dur - self.renderer.time)
        self.wait(remaining)


class NetworkEmergence(Scene):
    """Emergence: layers processing together → intelligence arises.
    Matches the network-emergence scene — the climactic "aha" moment.
    Shows a complete network with data flowing through, then the
    output crystallizing into a recognizable pattern (a face/word).
    Semantic color flow: SIGNAL → PROCESS → INSIGHT → RESULT."""

    def construct(self):
        dur = float(self.duration) if hasattr(self, 'duration') else 12.0
        self.camera.background_color = VOID

        # Build a 4-layer network (compact, centered)
        layers = []
        layer_sizes = [6, 8, 8, 3]
        layer_colors = [SIGNAL, PROCESS, INSIGHT, RESULT]
        layer_x = [-4, -1.3, 1.3, 4]

        for li, (size, color, x) in enumerate(zip(layer_sizes, layer_colors, layer_x)):
            nodes = VGroup()
            for ni in range(size):
                y_offset = (size - 1) / 2 * 0.5
                node = Circle(
                    radius=0.12, color=color,
                    fill_opacity=0.4, stroke_width=1.5
                )
                node.move_to(RIGHT * x + UP * (ni * 0.5 - y_offset))
                nodes.add(node)
            layers.append(nodes)

        # Connections between adjacent layers
        all_connections = VGroup()
        for li in range(len(layers) - 1):
            conns = VGroup()
            for n1 in layers[li]:
                for n2 in layers[li + 1]:
                    line = Line(
                        n1.get_right(), n2.get_left(),
                        stroke_width=0.3, color=BONE, stroke_opacity=0.1
                    )
                    conns.add(line)
            all_connections.add(conns)

        # Labels
        layer_labels = ["Input", "Hidden 1", "Hidden 2", "Output"]
        labels = VGroup()
        for li, (name, color) in enumerate(zip(layer_labels, layer_colors)):
            label = Text(name, font_size=14, color=color)
            label.next_to(layers[li], DOWN, buff=0.5)
            labels.add(label)

        # Phase 1: Build network structure (left to right)
        phase = dur / 6

        for li, layer in enumerate(layers):
            self.play(
                *[FadeIn(n, scale=0.5) for n in layer],
                run_time=phase * 0.4
            )
            if li < len(all_connections):
                self.play(FadeIn(all_connections[li], lag_ratio=0.01), run_time=phase * 0.3)

        self.play(*[FadeIn(l, shift=UP * 0.1) for l in labels], run_time=phase * 0.3)

        # Phase 2: Data pulse flows through (animated highlights)
        # Simulate activation: light up nodes layer by layer
        for pulse in range(2):
            for li, layer in enumerate(layers):
                highlights = VGroup()
                for node in layer:
                    glow = Circle(
                        radius=0.18, color=layer_colors[li],
                        fill_opacity=0.6, stroke_width=0
                    ).move_to(node)
                    highlights.add(glow)
                self.play(
                    *[FadeIn(h, scale=0.8) for h in highlights],
                    run_time=phase * 0.25
                )
                self.play(
                    *[FadeOut(h) for h in highlights],
                    run_time=phase * 0.15
                )

        # Phase 3: Emergence — output nodes glow brightly
        output_glow = VGroup()
        for node in layers[-1]:
            glow = Circle(
                radius=0.25, color=RESULT,
                fill_opacity=0.8, stroke_width=2
            ).move_to(node)
            output_glow.add(glow)

        emergence_label = Text(
            "Intelligence emerges", font_size=24, color=GOLD
        ).next_to(layers[-1], RIGHT, buff=0.6)

        self.play(
            *[Transform(layers[-1][i], output_glow[i]) for i in range(len(layers[-1]))],
            run_time=phase * 0.6
        )
        self.play(FadeIn(emergence_label, shift=RIGHT * 0.3), run_time=phase * 0.4)

        remaining = max(0.5, dur - self.renderer.time)
        self.wait(remaining)


# Scene registry
SCENES = {
    'neuron-diagram': NeuronDiagram,
    'layer-stack': LayerStack,
    'network-emergence': NetworkEmergence,
}

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Usage: manim-scenes.py <scene-name> <output-dir> <duration>")
        print(f"Available: {', '.join(SCENES.keys())}")
        sys.exit(1)

    scene_name = sys.argv[1]
    output_dir = sys.argv[2]
    duration = float(sys.argv[3])

    if scene_name not in SCENES:
        print(f"Unknown scene: {scene_name}. Available: {', '.join(SCENES.keys())}")
        sys.exit(1)

    SceneClass = SCENES[scene_name]

    # Configure manim
    config.pixel_width = 1920
    config.pixel_height = 1080
    config.frame_rate = 30
    config.background_color = VOID
    config.output_file = f"{scene_name}"
    config.media_dir = output_dir
    config.quality = "high_quality"

    scene = SceneClass()
    scene.duration = duration
    scene.render()

    print(f"✅ {scene_name} → {output_dir}")
