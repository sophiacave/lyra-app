#!/usr/bin/env python3
import os
import cv2
import subprocess
import argparse
import kling
from kling import interpolate_frames

def run_command(command):
    print(f"Running command: {command}")
    subprocess.run(command, shell=True, check=True)

def save_interpolated_video(frames, output_path):
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    height, width, layers = frames[0].shape
    video = cv2.VideoWriter(output_path, fourcc, 30, (width, height))
    for frame in frames:
        video.write(frame)
    cv2.destroyAllWindows()
    video.release()

def main():
    parser = argparse.ArgumentParser(description='Generate video from screenplay.')
    parser.add_argument('--phase', required=True, help='Phase to execute (e.g., interpolate)')
    parser.add_argument('--start_frame', help='Path to the start frame image')
    parser.add_argument('--end_frame', help='Path to the end frame image')
    parser.add_argument('--output_path', help='Output path for the interpolated video')
    args = parser.parse_args()

    if args.phase == 'upscale':
        upscale(args.input_path, args.output_path)
    elif args.phase == 'interpolate':
        start_frame = cv2.imread(args.start_frame)
        end_frame = cv2.imread(args.end_frame)
        interpolated_frames = interpolate_frames(start_frame, end_frame)
        save_interpolated_video(interpolated_frames, args.output_path)
    else:
        screenplay_path = os.path.abspath(args.screenplay)
        run_command(f'python3 /Users/sophiacave/lyra-app/studio/graphics-engine.py {screenplay_path} --all')
        run_command('python3 /Users/sophiacave/lyra-app/studio/music-generator.py')
        run_command('python3 /Users/sophiacave/lyra-app/studio/narration-generator.py')
        run_command('python3 /Users/sophiacave/lyra-app/studio/composer.py')
        run_command('python3 /Users/sophiacave/lyra-app/studio/cinema-grade-effects.py')
        run_command(f'ffmpeg -f concat -safe 0 -i /Users/sophiacave/lyra-app/concat_list.txt -c copy /Users/sophiacave/lyra-app/final_video.mp4')

if __name__ == '__main__':
    main()
