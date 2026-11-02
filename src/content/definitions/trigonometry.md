## A circle supplies the two numbers

On a circle of radius one, turn counterclockwise through angle $\theta$ from the point $(1,0)$. The point reached has horizontal coordinate $\cos\theta$ and vertical coordinate $\sin\theta$. Angles are measured in **radians**: one full turn is $2\pi$, a half turn is $\pi$, and a quarter turn is $\pi/2$. Here $\pi\approx3.14159$ is the circumference-to-diameter ratio.

The point stays a distance one from the origin, so $\cos^2\theta+\sin^2\theta=1$. At $\theta=0$, the pair is $(1,0)$; at $\pi/2$ it is $(0,1)$; at $\pi$ it is $(-1,0)$. At $\pi/4$, both coordinates are $1/\sqrt2$, because two equal squares must sum to one.

## Why quantum algorithms need these numbers

The column $(\cos\theta,\sin\theta)^T$ is a normalized real qubit state. Squaring its entries gives measurement probabilities. Changing $\theta$ changes the distribution while preserving normalization. A rotation matrix is

$$R(\theta)=\begin{pmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{pmatrix}.$$

For $\theta=\pi/6$, its first column is $(\sqrt3/2,1/2)^T$, whose probabilities are $3/4,1/4$. Multiplying two rotations adds their angles. Row-by-column multiplication gives the identities

$$\cos(a+b)=\cos a\cos b-\sin a\sin b,$$
$$\sin(a+b)=\sin a\cos b+\cos a\sin b.$$

Using $a=b$ gives $\cos2a=2\cos^2a-1$ and $\sin2a=2\sin a\cos a$. Applying addition once more gives $\sin3a=3\sin a-4\sin^3a$. Grover's two-reflection step uses precisely this rotation arithmetic.

## Inverse functions and phase

$\arcsin s$ asks for the angle in $[-\pi/2,\pi/2]$ whose sine is $s$. Thus $\arcsin(1/2)=\pi/6$. $\arccos c$ asks for the angle in $[0,\pi]$ whose cosine is $c$; $\arccos(1/2)=\pi/3$. The interval matters because many angles share the same sine or cosine.

Writing a complex number as $a+bi$, where $i^2=-1$, $e^{i\theta}=\cos\theta+i\sin\theta$. Its magnitude is one, so multiplying an amplitude by this number changes phase but not immediate probability. At $\theta=\pi/2$, the factor is $i$; at $\pi$, it is $-1$. QFT adds such complex contributions; their real and imaginary parts can cancel independently.

We needed trigonometry to specify normalized rotations and phase factors. Return to the originating equation and replace each sine/cosine with either its unit-circle meaning or the numerical value of the stated angle. No classical wave analogy is required.
