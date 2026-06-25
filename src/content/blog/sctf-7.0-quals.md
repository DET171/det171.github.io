---
title: 'SCTF 7.0 Quals Writeup'
pubDatetime: 2026-06-20
description: 'One (1) singular writeup for SCTF 7.0 Quals'
tags: ['ctf', 'writeup', 'sctf']
featured: true
draft: false
---

# SCTF 7.0 Quals Writeup

This page contains, at the moment, just one writeup for a challenge from SCTF 7.0. I might add more in the future depending on how I feel.

## sussy2 (Forens)

The solution for this one was rather cheesy, not to mention the challenge itself also being slightly questionable (which is why I'm posting it). I have no clue what the intended solve was, nor do I intend to find out.

Either way, the challenge provides us with a `dist.zip` file, which, after unzipping, gives us the following:

```sh
/tmp/sussy2 ⌚ 21:51:21
$ ls
Permissions Size User    Date Modified Name
.rw-r--r--  6.2k canaris  1 Jan  1981  󰗀 AndroidManifest.xml
.rw-r--r--   19M canaris  1 Jan  1981   classes.dex
.rw-r--r--   56k canaris  1 Jan  1981   classes2.dex
.rw-r--r--   10k canaris  1 Jan  1981   classes3.dex
.rw-r--r--   13k canaris  1 Jan  1981   classes4.dex
.rw-r--r--  123k canaris  1 Jan  1981   classes5.dex
.rw-r--r--  9.6M canaris  1 Jan  1981   classes6.dex
.rw-r--r--  1.7k canaris  1 Jan  1981   DebugProbesKt.bin
drwxr-xr-x     - canaris 14 Jun 18:18   kotlin
drwxr-xr-x     - canaris 14 Jun 18:18   lib
drwxr-xr-x     - canaris 14 Jun 18:18   META-INF
.rw-r--r--    16 canaris 14 Jun 18:21   nothere.txt
drwxr-xr-x     - canaris 14 Jun 18:18   res
.rw-r--r--  479k canaris  1 Jan  1981   resources.arsc
```

We do some classic stringing and grepping for the common patterns:

```sh
/tmp/sussy2 ⌚ 22:07:34
$ strings ./* | grep "sctf{"
strings: Warning: './kotlin' is a directory
strings: Warning: './lib' is a directory
strings: Warning: './META-INF' is a directory
strings: Warning: './res' is a directory
sctf{fake_flag}
```

Just the slightest bit of intuition tells us that this probably isn't the flag, so we try our luck with the most common base64 pattern that flags usually appear in:

```sh
/tmp/sussy2 ⌚ 22:07:38
$ strings ./* | grep "=="
0CmZwZ3N7VnNfMnU4ZThfajlmXzlhXzhhcWM1dmEyISEhfQ==
==n
-y==iZ..
-jiZ==
I]<<jZ==
<iZ==
==KxZK<K
...
```

Oh look, what's that?

```sh
/tmp/sussy2 ⌚ 22:09:09
$ echo 'CmZwZ3N7VnNfMnU4ZThfajlmXzlhXzhhcWM1dmEyISEhfQ==' | base64 -d

fpgs{Vs_2u8e8_j9f_9a_8aqc5va2!!!}
```

Run that through ROT13 and we get:

```
sctf{If_2h8r8_w9s_9n_8ndp5in2!!!}
```

The numbers, however, are all apparently off by 5, which is the most asinine part of this challenge:

```
sctf{If_7h3r3_w4s_4n_3ndp0in7!!!}
```

That's it.

P.S. Screw you Aiden.
