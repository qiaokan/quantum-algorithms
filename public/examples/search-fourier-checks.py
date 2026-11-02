"""Independent, standard-library checks of lessons 01–22's worked instances.

Run: python3 search-fourier-checks.py
These are ideal finite-state calculations, not hardware experiments.
Includes independent review fixtures for root-authored lessons 01–05.
The matrices act on column vectors; basis integers are big-endian.
"""
import cmath
import math
import unittest


def norm(v):
    return sum(abs(z) ** 2 for z in v)


def mm(a, v):
    return [sum(x * y for x, y in zip(row, v)) for row in a]


def fourier(v, inverse=False):
    n = len(v)
    sign = -1 if inverse else 1
    return [sum(v[x] * cmath.exp(sign * 2j * math.pi * x * y / n)
                for x in range(n)) / math.sqrt(n) for y in range(n)]


def grover(v, marked):
    tagged = [-z if k in marked else z for k, z in enumerate(v)]
    mean = sum(tagged) / len(tagged)
    return [2 * mean - z for z in tagged]


def qpe_probabilities(phi, bits):
    n = 2 ** bits
    v = [cmath.exp(2j * math.pi * phi * x) / math.sqrt(n) for x in range(n)]
    return [abs(z) ** 2 for z in fourier(v, inverse=True)]


def amplitude_probabilities(a, bits):
    phi = math.asin(math.sqrt(a)) / math.pi
    p = qpe_probabilities(phi, bits)
    q = qpe_probabilities(1 - phi, bits)
    return [(x + y) / 2 for x, y in zip(p, q)]


def phase_on(v, axis, z):
    overlap = sum(x.conjugate() * y for x, y in zip(axis, v))
    return [y + (z - 1) * x * overlap for x, y in zip(axis, v)]


def factors_from_order(n, a, r):
    if r <= 0 or r % 2 or pow(a, r, n) != 1:
        return None
    t = pow(a, r // 2, n)
    if t in (1, n - 1):
        return None
    d = math.gcd(t - 1, n)
    e = math.gcd(t + 1, n)
    return (d, e) if 1 < d < n and 1 < e < n else None


class WorkedInstances(unittest.TestCase):
    def assertVector(self, a, b, tolerance=1e-11):
        self.assertEqual(len(a), len(b))
        self.assertTrue(all(abs(x-y) < tolerance for x, y in zip(a, b)), (a, b))

    def test_general_amplification(self):
        a = .25
        q = [[1-2*a, -2*math.sqrt(a*(1-a))],
             [2*math.sqrt(a*(1-a)), 1-2*a]]
        s = [math.sqrt(3)/2, .5]
        v = mm(q, s)
        self.assertVector(v, [0, 1])
        self.assertAlmostEqual(norm(v), 1)
        self.assertVector(mm(q, v), [-math.sqrt(3)/2, .5])

    def test_bbht_multiple(self):
        v = grover([1/math.sqrt(8)]*8, {1,6})
        self.assertVector(v, [1/math.sqrt(2) if i in (1,6) else 0 for i in range(8)])
        self.assertAlmostEqual(norm(v), 1)
        abundant = grover([1/math.sqrt(8)]*8, set(range(6)))
        self.assertAlmostEqual(sum(abs(abundant[i])**2 for i in range(6)), 0)

    def test_fixed_point(self):
        z = (1+15j*math.sqrt(3))/26
        self.assertAlmostEqual(abs(z), 1)
        s = [complex(1/math.sqrt(2))]*2
        v = phase_on(phase_on(s, [0j,1+0j], z), s, z)
        self.assertVector(v, [(1+z*z)/(2*math.sqrt(2)),
                              (z*z+2*z-1)/(2*math.sqrt(2))])
        self.assertAlmostEqual(abs(v[0])**2, 1/1352)
        self.assertAlmostEqual(norm(v), 1)
        for k in range(361,1001):
            a = k/1000
            s = [complex(math.sqrt(1-a)), complex(math.sqrt(a))]
            v = phase_on(phase_on(s,[0j,1+0j],z),s,z)
            x = math.sqrt(1-a)/.8
            predicted = (16/65)**2 * (4*x**3-3*x)**2
            self.assertAlmostEqual(abs(v[0])**2,predicted)
            self.assertLessEqual(predicted,(16/65)**2+1e-12)
            self.assertAlmostEqual(norm(v),1)

    def test_minimum_and_collision(self):
        table = [7,2,9,4]
        marked = {i for i,t in enumerate(table) if t < 4}
        self.assertVector(grover([.5]*4,marked),[0,1,0,0])
        f=[0,1,2,3,0,1,2,3]
        sample={0,1}
        marked={i for i in range(8) if i not in sample and f[i] in {f[j] for j in sample}}
        self.assertEqual(marked,{4,5})
        v=grover([1/math.sqrt(8)]*8,marked)
        self.assertVector(v,[1/math.sqrt(2) if i in marked else 0 for i in range(8)])

    def test_qft_and_inverse(self):
        self.assertVector(fourier([0,1,0,0]),[.5,.5j,-.5,-.5j])
        for n in (2,4,8,16):
            for x in range(n):
                v=[complex(i==x) for i in range(n)]
                transformed=fourier(v)
                self.assertAlmostEqual(norm(transformed),1)
                self.assertVector(fourier(transformed,True),v)
        v=[1/math.sqrt(2),0,1/math.sqrt(2),0]
        self.assertVector(fourier(v),v)

    def test_qft_gate_decomposition(self):
        # H_left, controlled phase pi/2, H_right, then SWAP.
        h=1/math.sqrt(2)
        for x in range(4):
            v=[complex(i==x) for i in range(4)]
            v=[h*(v[0]+v[2]),h*(v[1]+v[3]),h*(v[0]-v[2]),h*(v[1]-v[3])]
            v[3]*=1j
            v=[h*(v[0]+v[1]),h*(v[0]-v[1]),h*(v[2]+v[3]),h*(v[2]-v[3])]
            v=[v[0],v[2],v[1],v[3]]
            self.assertVector(v,fourier([complex(i==x) for i in range(4)]))

    def test_qpe(self):
        self.assertVector(qpe_probabilities(3/8,3),[0,0,0,1,0,0,0,0])
        expected=[1/16,(3+math.sqrt(3))**2/32,3/16,(3-math.sqrt(3))**2/32]
        self.assertVector(qpe_probabilities(1/3,2),expected)
        self.assertAlmostEqual(sum(expected),1)

    def test_iterative_phase(self):
        phi=3/8
        b3=round((1-math.cos(2*math.pi*4*phi))/2)
        b2=round((1-math.cos(2*math.pi*(2*phi-b3/4)))/2)
        b1=round((1-math.cos(2*math.pi*(phi-b2/4-b3/8)))/2)
        self.assertEqual((b1,b2,b3),(0,1,1))

    def test_period_and_shor(self):
        v=[.5 if x in (1,5,9,13) else 0 for x in range(16)]
        out=fourier(v)
        self.assertVector(out,[{0:.5,4:.5j,8:-.5,12:-.5j}.get(y,0) for y in range(16)])
        self.assertEqual(factors_from_order(21,2,6),(7,3))
        for a,r in ((4,3),(20,2),(2,3),(2,12)):
            self.assertIsNone(factors_from_order(21,a,r))
        packet=[1/math.sqrt(86) if x%6==0 else 0 for x in range(512)]
        out=fourier(packet)
        self.assertAlmostEqual(abs(out[85])**2,.1141718203196482)
        self.assertAlmostEqual(norm(out),1)

    def test_discrete_log(self):
        # Direct two-register Fourier transform of x=3y modulo 8.
        p={}
        for u in range(8):
            for v in range(8):
                amp=sum(cmath.exp(2j*math.pi*(u*((3*y)%8)+v*y)/8)
                        for y in range(8))/(8*math.sqrt(8))
                p[u,v]=abs(amp)**2
                self.assertAlmostEqual(p[u,v],1/8 if (3*u+v)%8==0 else 0)
        self.assertAlmostEqual(sum(p.values()),1)
        self.assertEqual(pow(2,3,17),8)

    def test_hsp(self):
        v=[1/math.sqrt(2) if x in (1,5) else 0 for x in range(8)]
        out=fourier(v)
        self.assertVector([abs(a)**2 for a in out],[.25 if y%2==0 else 0 for y in range(8)])

    def test_count_and_amplitude(self):
        self.assertVector(amplitude_probabilities(.5,2),[0,.5,0,.5])
        expected=[.046875,.35322815184059725,.09375,.02177184815940294,
                  .015625,.02177184815940294,.09375,.35322815184059725]
        self.assertVector(amplitude_probabilities(.25,3),expected)
        self.assertAlmostEqual(sum(expected),1)

    def test_iqae_and_mean(self):
        endpoints=[math.sin(math.asin(math.sqrt(q))/3)**2 for q in (.75,.8125)]
        self.assertVector(endpoints,[.11697777844051097,.13369328129526076])
        self.assertLess(endpoints[0],.125)
        self.assertGreater(endpoints[1],.125)
        amplitudes=[.5,0,math.sqrt(3)/4,.25,math.sqrt(3)/4,.25,0,.5]
        self.assertAlmostEqual(norm(amplitudes),1)
        self.assertAlmostEqual(sum(abs(amplitudes[i])**2 for i in (1,3,5,7)),3/8)

    def test_jordan(self):
        chi=[.5,-.5j,-.5,.5j]
        shifted=[chi[(j-1)%4] for j in range(4)]
        self.assertVector(shifted,[1j*x for x in chi])
        v=[(1j)**(x+2*y)/4 for x in range(4) for y in range(4)]
        out=[]
        for r in range(4):
            for s in range(4):
                out.append(sum(v[4*x+y]*cmath.exp(-2j*math.pi*(r*x+s*y)/4)
                               for x in range(4) for y in range(4))/4)
        self.assertVector(out,[complex(i==6) for i in range(16)])
        self.assertAlmostEqual(norm(out),1)

    def test_deutsch_all_truth_tables_independent(self):
        # Direct input-only phase reduction, checked against the full joint oracle.
        for values in ((0,0),(0,1),(1,0),(1,1)):
            v=[.5,-.5,.5,-.5]
            perm=[0j]*4
            for x in (0,1):
                for y in (0,1):
                    perm[2*x+(y^values[x])]=v[2*x+y]
            h=1/math.sqrt(2)
            out=[h*(perm[0]+perm[2]),h*(perm[1]+perm[3]),
                 h*(perm[0]-perm[2]),h*(perm[1]-perm[3])]
            wanted=values[0]^values[1]
            prob=sum(abs(out[2*wanted+y])**2 for y in (0,1))
            self.assertAlmostEqual(prob,1)
            self.assertAlmostEqual(norm(out),1)

    def test_grover_all_marks_iterations_independent(self):
        for mark in range(4):
            v=[.5]*4
            for expected in (1,.25,.25,1):
                v=grover(v,{mark})
                self.assertAlmostEqual(abs(v[mark])**2,expected)
                self.assertAlmostEqual(norm(v),1)

    def test_bv_all_masks_independent(self):
        for mask in range(8):
            signs=[(-1)**((mask&x).bit_count()%2)/math.sqrt(8) for x in range(8)]
            out=[sum(signs[x]*(-1)**((x&y).bit_count()%2) for x in range(8))/math.sqrt(8)
                 for y in range(8)]
            self.assertVector(out,[complex(y==mask) for y in range(8)])
        and_signs=[.5,.5,.5,-.5]
        out=[sum(and_signs[x]*(-1)**((x&y).bit_count()%2) for x in range(4))/2 for y in range(4)]
        self.assertVector(out,and_signs)

    def test_dj_all_two_bit_promises_independent(self):
        import itertools
        for values in itertools.product((0,1),repeat=4):
            ones=sum(values)
            zero_amplitude=sum((-1)**value for value in values)/4
            if ones in (0,4): self.assertAlmostEqual(abs(zero_amplitude)**2,1)
            if ones==2: self.assertAlmostEqual(abs(zero_amplitude)**2,0)
            if ones in (1,3): self.assertAlmostEqual(abs(zero_amplitude)**2,.25)

    def test_simon_all_masks_independent(self):
        for mask in range(1,8):
            probabilities=[]
            for y in range(8):
                p=0
                for fvalue in range(8):
                    amplitude=sum((-1)**((x&y).bit_count()%2)
                                  for x in range(8) if min(x,x^mask)==fvalue)/8
                    p+=abs(amplitude)**2
                probabilities.append(p)
            self.assertVector(probabilities,[.25 if (mask&y).bit_count()%2==0 else 0 for y in range(8)])
            self.assertAlmostEqual(sum(probabilities),1)

    def test_jordan_nonlinear_rounding(self):
        n=8;scale=4;width=.01;levels=4096
        q=[]
        for x in range(n):
            u=width*(x/n-.5)
            value=.5*u+.5*u*u
            q.append(round(levels*scale*value/width))
        self.assertEqual([v%levels for v in q],[20,1036,2053,3073,0,1025,2053,3084])
        state=[cmath.exp(2j*math.pi*v/levels)/math.sqrt(n) for v in q]
        result=fourier(state,inverse=True)
        self.assertAlmostEqual(norm(result),1)
        self.assertAlmostEqual(abs(result[2])**2,.9998976449065248)
        bound=(math.pi*scale*width/4+math.pi/levels)**2
        self.assertLessEqual(1-abs(result[2])**2,bound)
        self.assertAlmostEqual(bound,.0010357401421130304)


if __name__=='__main__':
    unittest.main(verbosity=2)
