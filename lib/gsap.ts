'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { Flip } from 'gsap/Flip'

let registered = false

export function registerGSAP() {
  if (registered) return
  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    DrawSVGPlugin,
    ScrambleTextPlugin,
    Flip,
  )
  registered = true
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, ScrambleTextPlugin, Flip }
