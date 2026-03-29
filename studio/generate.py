#!/usr/bin/env python3
import argparse
import kling
# from mflux import upscale_seedvr2
import requests
from kling import interpolate_frames
import subprocess
cv2
import os
import cv2
print(f'OpenCV version: {cv2.__version__}')
def main():
    args = parse_arguments()

    if args.phase == 'generate_scenes_parallel':
        scenes = [
            {'prompt': 'Scene 1', 'seed': 1},
            {'prompt': 'Scene 2', 'seed': 2},
            {'prompt': 'Scene 3', 'seed': 3},
            {'prompt': 'Scene 4', 'seed': 4}
        ]
        generate_scenes_in_parallel(scenes)
    elif args.phase == 'concat':
        video_files = [f'output/scene_{i}.mp4' for i in range(1, 4)]  # Example list of video files
        concat_videos(video_files, 'final_output.mp4')
    elif args.phase == 'interpolate':
        from kling import interpolate_frames
        if not args.start_frame or not args.end_frame or not args.output_video:
            raise ValueError('Start frame, end frame, and output video must be specified for interpolation.')
        import imageio
import numpy as np

interpolated_frames = interpolate_frames(args.start_frame, args.end_frame)
frames = [imageio.imread(frame) for frame in interpolated_frames]
imageio.mimsave('temp_interpolation.mp4', frames, fps=30)
run_command(f'ffmpeg -i temp_interpolation.mp4 {args.output_video}', cwd='/Users/sophiacave/lyra-app/studio')
os.remove('temp_interpolation.mp4')
elif args.phase == 'upscale':
    upscale_images()
    # elif args.phase == 'upscale':
    #     upscale_keyframes()
    elif args.phase == 'narrate' and args.engine == 's2-pro':
        generate_voice_clone(args.narration, args.voice)

if __name__ == "__main__":
    main()

def run_command(command, cwd=None):
    result = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception(f'Command failed: {result.stderr}')
    return result.stdout

# Define directories
input_dir = 'path/to/input'
output_dir = 'path/to/output'

def upscale_images():
    print('Upscaling images using mflux-upscale-seedvr2...')
    run_command(f'mflux-upscale-seedvr2 --input {input_dir} --output {output_dir}', cwd='/Users/sophiacave/lyra-app/studio')

def parse_arguments():
    parser = argparse.ArgumentParser(description='Like One Studio — Unified Pipeline')
    parser.add_argument('--phase', type=str, choices=['keyframe', 'music', 'narrate', 'compose', 'concat', 'interpolate', 'upscale', 'generate_scenes_parallel'], help='Specify the phase of the pipeline to run')
    parser.add_argument('--start_frame', type=str, help='Path to the start frame image for interpolation')
    parser.add_argument('--end_frame', type=str, help='Path to the end frame image for interpolation')
    parser.add_argument('--output_video', type=str, help='Output path for the interpolated video')
    parser.add_argument('--engine', type=str, default='fish', choices=['fish', 's2-pro'], help='Specify the engine for narration')
    
    parser.add_argument('--voice', type=str, help='Specify the voice to use for narration')
    parser.add_argument('--narration', type=str, help='Text to narrate')
    return parser.parse_args()


def generate_voice_clone(text, voice):
    # Call the S2 Pro model to generate voice clone
    print(f'Generating voice clone for text: {text} with voice: {voice}')


def concat_videos(video_files, output_video):
    with open('concat_list.txt', 'w') as f:
        for video_file in video_files:
            f.write(f"file '{video_file}'\n")
    run_command(f'ffmpeg -f concat -safe 0 -i concat_list.txt -c copy {output_video}', cwd='/Users/sophiacave/lyra-app/studio')

import concurrent.futures
import time

def generate_keyframe(prompt, seed=None):
    print(f'Starting generation for prompt: {prompt} with seed: {seed}')
    time.sleep(2)  # Simulate a delay to observe parallel execution
    print(f'Finished generation for prompt: {prompt} with seed: {seed}')
    return f'keyframe_{seed}.png'

def generate_scenes_in_parallel(scenes, num_workers=4):
    with concurrent.futures.ThreadPoolExecutor(max_workers=num_workers) as executor:
        futures = {executor.submit(generate_keyframe, scene['prompt'], scene.get('seed')): scene for scene in scenes}
        results = [future.result() for future in concurrent.futures.as_completed(futures)]
    return results

if __name__ == "__main__":
    args = parse_arguments()

    if args.phase == 'generate_scenes_parallel':
        scenes = [
            {'prompt': 'Scene 1', 'seed': 1},
            {'prompt': 'Scene 2', 'seed': 2},
            {'prompt': 'Scene 3', 'seed': 3},
            {'prompt': 'Scene 4', 'seed': 4}
        ]
        generate_scenes_in_parallel(scenes)
    elif args.phase == 'concat':
        video_files = [f'output/scene_{i}.mp4' for i in range(1, 4)]  # Example list of video files
        concat_videos(video_files, 'final_output.mp4')
    elif args.phase == 'interpolate':
        from kling import interpolate_frames
        if not args.start_frame or not args.end_frame or not args.output_video:
            raise ValueError('Start frame, end frame, and output video must be specified for interpolation.')
        import imageio
import numpy as np

interpolated_frames = interpolate_frames(args.start_frame, args.end_frame)
frames = [imageio.imread(frame) for frame in interpolated_frames]
imageio.mimsave('temp_interpolation.mp4', frames, fps=30)
run_command(f'ffmpeg -i temp_interpolation.mp4 {args.output_video}', cwd='/Users/sophiacave/lyra-app/studio')
os.remove('temp_interpolation.mp4')
elif args.phase == 'upscale':
    upscale_images()
    # elif args.phase == 'upscale':
    #     upscale_keyframes()
    elif args.phase == 'narrate' and args.engine == 's2-pro':
        generate_voice_clone(args.narration, args.voice)
