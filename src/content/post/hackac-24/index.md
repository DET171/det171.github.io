---
title: "HACK@AC '24"
publishDate: "28 February 2024"
description: "A couple of write-ups for the HACK@AC 2024 Capture the Flag event"
tags: ["ctf", "forensics", "writeup"]
ogImage: "/social-card.png"
draft: false
---

I recently took part in the HACK@AC 2024 CTF (which was objectively easier than Blahaj CTF btw), and I thought I'd do a couple write ups.

## 'Homework' folder

This challenge was classified as a forensics challenge, and the description was as follows:

![chall description](./image.png)

We go ahead and run a `binwalk` on `capture.sal`, and we're met with the following:

```bash
$ binwalk -e capture.sal

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             Zip archive data, at least v2.0 to extract, name: digital-0.bin
1684          0x694           Zip archive data, at least v2.0 to extract, name: digital-1.bin
4235          0x108B          Zip archive data, at least v2.0 to extract, name: digital-2.bin
12377         0x3059          Zip archive data, at least v2.0 to extract, name: digital-3.bin
13892         0x3644          Zip archive data, at least v2.0 to extract, name: digital-4.bin
15319         0x3BD7          Zip archive data, at least v2.0 to extract, name: digital-7.bin
16746         0x416A          Zip archive data, at least v2.0 to extract, name: digital-5.bin
18173         0x46FD          Zip archive data, at least v2.0 to extract, name: digital-6.bin
19600         0x4C90          Zip archive data, at least v2.0 to extract, name: meta.json
21596         0x545C          End of Zip archive, footer length: 22
```

We `cd` into the `_capture.sal.extracted` directory and we're met with a bunch of `.bin` files. Running a `binwalk` on these `.bin` files yield nothing interesting, so we turn to `strings`:

```bash
$ strings digital-0.bin
<SALEAE>
@A|^:A
Oc:A
I|:A
_HqA
IP:L<2
J':A

$ strings digital-1.bin
<SALEAE>

$ strings digital-2.bin
<SALEAE>
```

After running it a couple times, we can see that each `.bin` file contains the string `<SALEAE>`. A quick google search tells us that this is the header for a Saleae Logic Analyzer file, so we go ahead and download the Logic 2 analyzer they have kindly provided us with ([link](https://www.saleae.com/downloads/)).

After downloading it, we open `capture.sal` and we're met with the following:

![saleae](./image-1.png)

After filtering through the user manual for a good 30 minutes or so, we discover that the SPI Analyzer can be used to analyze the MISO and MOSI signals. let's go ahead and add the SPI Analyzer:

![analyzer](./image-2.png)

Now we just need to search for the flag. My dumbass spent a good afternoon trying to manually find to flag until I realised I could have just gone to the data tab on the right and searched for a open brace (`{`).

...And yeah, that's pretty much it. That's the flag.

`ACSI{d1d_y0u_r34d_th3_SD_SPI_sp3c5?}`

~speedran this during chinese so do expect some grammatical errors~
