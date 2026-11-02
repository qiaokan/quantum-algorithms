#!/usr/bin/env python3
"""Independent stdlib arithmetic checks for the authored 2x2 examples.
These are classical ideal simulations, not hardware runs or large algorithms.
Run after downloading: python3 matrix-checks.py
"""
import cmath
import math
import unittest

I = [[1, 0], [0, 1]]
X = [[0, 1], [1, 0]]
Z = [[1, 0], [0, -1]]

def mm(a, b):
    assert len(a[0]) == len(b)
    return [[sum(a[i][k]*b[k][j] for k in range(len(b))) for j in range(len(b[0]))] for i in range(len(a))]

def mv(a, v):
    return [sum(x*y for x, y in zip(row, v)) for row in a]

def adj(a):
    return [[complex(a[j][i]).conjugate() for j in range(len(a))] for i in range(len(a[0]))]

def add(a, b):
    return [[x+y for x, y in zip(r, s)] for r, s in zip(a, b)]

def scale(s, a):
    return [[s*x for x in row] for row in a]

def eye(n):
    return [[int(i == j) for j in range(n)] for i in range(n)]

def norm2(v):
    return sum(abs(z)**2 for z in v)

def outer(v):
    return [[a*complex(b).conjugate() for b in v] for a in v]

def pauli_exp(p, t):
    return add(scale(math.cos(t), I), scale(-1j*math.sin(t), p))

def signal(x):
    c = math.sqrt(1-x*x)
    return [[x, 1j*c], [1j*c, x]]

class MatrixExamples(unittest.TestCase):
    def close(self, a, b, tol=1e-11):
        if isinstance(a, (list, tuple)):
            self.assertEqual(len(a), len(b))
            for x, y in zip(a, b): self.close(x, y, tol)
        else: self.assertLess(abs(a-b), tol)

    def unitary(self, a): self.close(mm(adj(a), a), eye(len(a)))

    def test_product_formula(self):
        t = math.pi/4
        approx = mv(mm(pauli_exp(Z, t), pauli_exp(X, t)), [1, 0])
        self.close(approx, [(1-1j)/2, (1-1j)/2])
        h = add(X, Z)
        exact_u = add(scale(math.cos(math.sqrt(2)*t), I), scale(-1j*math.sin(math.sqrt(2)*t)/math.sqrt(2), h))
        exact = mv(exact_u, [1, 0])
        self.close(norm2(approx), 1)
        self.close(norm2(exact), 1)
        self.close(abs(exact[1])**2, 0.4014249667697033)
        errors = []
        for r in (1, 2, 4, 8):
            u = eye(2)
            step = mm(pauli_exp(Z, t/r), pauli_exp(X, t/r))
            for _ in range(r): u = mm(step, u)
            self.unitary(u)
            errors.append(math.sqrt(norm2([x-y for x,y in zip(mv(u,[1,0]),exact)])))
        self.assertTrue(all(errors[i+1]<errors[i] for i in range(3)))

    def test_qdrift_channel_not_vector_average(self):
        tau = 0.9
        vx=mv(pauli_exp(X,tau),[1,0]); vz=mv(pauli_exp(Z,tau),[1,0])
        rho=add(scale(2/3,outer(vx)),scale(1/3,outer(vz)))
        p=2/3*math.sin(tau)**2
        self.close(rho[1][1],p)
        self.close(rho[0][0]+rho[1][1],1)
        averaged=[2/3*x+1/3*z for x,z in zip(vx,vz)]
        self.assertGreater(abs(norm2(averaged)-1),0.1)
        self.close(p,0.4090673648976957)

    def test_energy_fourier_cancellation(self):
        for phase, label in ((1/4,1),(3/4,3)):
            out=[sum(cmath.exp(2j*math.pi*k*(phase-y/4)) for k in range(4))/4 for y in range(4)]
            self.close(out,[int(y==label) for y in range(4)])
        self.close((1-3/4)**4,1/256)

    def test_hhl_postselection(self):
        # Explicit normalized state after coherent labeling and reciprocal flag rotation.
        v=[0j]*16
        v[(1<<2)|(0<<1)|1]=1/math.sqrt(2)
        v[(2<<2)|(1<<1)|0]=math.sqrt(3)/(2*math.sqrt(2))
        v[(2<<2)|(1<<1)|1]=1/(2*math.sqrt(2))
        self.close(norm2(v),1)
        # Erase the exact eigenvalue label by its inverse map for this diagonal toy.
        w=[0j]*16
        for index,amplitude in enumerate(v):
            e=index>>2; s=(index>>1)&1; f=index&1
            w[((e^(1 if s==0 else 2))<<2)|(s<<1)|f]=amplitude
        self.close(norm2(w),1)
        good=[w[1],w[3]]
        self.close(norm2(good),5/8)
        normalized=[x/math.sqrt(5/8) for x in good]
        self.close(normalized,[2/math.sqrt(5),1/math.sqrt(5)])
        classical=[1/math.sqrt(2),1/(2*math.sqrt(2))]
        self.close(good,classical)
        h=scale(1/math.sqrt(2),[[1,1],[1,-1]])
        self.close(abs(mv(h,normalized)[0])**2,0.9)

    def test_lcu_encoding(self):
        b=scale(.5,add(Z,X)); c=scale(.5,add(Z,scale(-1,X)))
        w=[b[0]+c[0],b[1]+c[1],c[0]+b[0],c[1]+b[1]]
        self.unitary(w)
        out=mv(w,[1,0,0,0]); self.close(out,[.5,.5,.5,-.5])
        self.close(norm2(out[:2]),.5)

    def test_oblivious_amplification(self):
        s=.5; c=math.sqrt(3)/2
        w=[[s,-c],[c,s]]; r=[[-1,0],[0,1]]
        full=scale(-1,mm(mm(mm(mm(w,r),adj(w)),r),w))
        self.unitary(full); self.close(mv(full,[1,0]),[1,0])
        self.close(3*.25-4*.25**3,11/16)

    def test_taylor_lcu(self):
        t2=add(scale(7/8,I),scale(-.5j,X))
        out=mv(scale(8/11,t2),[1,0])
        self.close(out,[7/11,-4j/11]); self.close(norm2(out),65/121)
        accepted=[x/math.sqrt(65/121) for x in out]
        self.close(abs(accepted[1])**2,16/65)
        self.close(norm2(mv(t2,[1,0])),65/64)

    def test_qubitization_plane(self):
        a=.5; s=math.sqrt(1-a*a); q=[[a,s],[-s,a]]
        self.unitary(q)
        v=[1,0]
        for expected in ([.5,-math.sqrt(3)/2],[-.5,-math.sqrt(3)/2],[-1,0]):
            v=mv(q,v); self.close(v,expected); self.close(norm2(v),1)

    def test_signal_processing(self):
        for x in (-1,-.6,0,.5,1):
            w=signal(x); self.unitary(w)
            w2=mm(w,w); self.close(w2[0][0],2*x*x-1)
            self.close(mm(mm(w,[[1j,0],[0,-1j]]),w),[[1j,0],[0,-1j]])

    def test_qsvt_nonhermitian(self):
        c=math.sqrt(3)/2
        w=[[0,.5,c,0],[1,0,0,0],[0,0,0,-1],[0,c,-.5,0]]
        r=[[-1,0,0,0],[0,-1,0,0],[0,0,1,0],[0,0,0,1]]
        self.unitary(w)
        u=scale(-1,mm(mm(mm(mm(w,r),adj(w)),r),w))
        self.unitary(u)
        self.close([row[:2] for row in u[:2]],[[0,1],[-1,0]])
        out=mv(u,[1/math.sqrt(2),1/math.sqrt(2),0,0])
        self.close(out,[1/math.sqrt(2),-1/math.sqrt(2),0,0])
        a=[[0,.5],[1,0]]
        ordinary=add(scale(3,a),scale(-4,mm(mm(a,a),a)))
        self.close(ordinary,a)
        self.assertNotEqual(ordinary,[row[:2] for row in u[:2]])

    def test_polynomial_solver(self):
        p=lambda x:(5*x-4*x**3)/3
        v=[p(.5)/math.sqrt(2),p(1)/math.sqrt(2)]
        self.close(norm2(v),5/18)
        self.close([x/math.sqrt(5/18) for x in v],[2/math.sqrt(5),1/math.sqrt(5)])

    def test_ground_and_thermal_filter(self):
        self.close(.2/(.2+.8*.1**2),25/26)
        pure=[1/math.sqrt(2),1/(2*math.sqrt(2))]
        self.close(norm2(pure),5/8)
        gibbs=[abs(z)**2/(5/8) for z in pure]
        self.close(gibbs,[.8,.2])

    def test_density_matrix_exponentiation(self):
        rho=[[.75,0],[0,.25]]; sigma=[[.5,.5],[.5,.5]]
        c=math.sqrt(3)/2; s=.5
        comm=add(mm(rho,sigma),scale(-1,mm(sigma,rho)))
        out=add(add(scale(c*c,sigma),scale(s*s,rho)),scale(-1j*s*c,comm))
        self.close(out,[[9/16,3/8-1j*math.sqrt(3)/16],[3/8+1j*math.sqrt(3)/16,7/16]])
        self.close(out[0][0]+out[1][1],1)
        self.assertGreater((out[0][0]*out[1][1]-abs(out[0][1])**2).real,0)

    def test_ode_history_and_contraction(self):
        xs=[[1/math.sqrt(2),1/math.sqrt(2)]]
        for _ in range(2): xs.append(mv([[.75,0],[0,.5]],xs[-1]))
        ns=[norm2(v) for v in xs]
        self.close(ns,[1,13/32,97/512]); self.close(sum(ns),817/512)
        self.close(ns[-1]/sum(ns),97/817)
        self.close([z/math.sqrt(ns[-1]) for z in xs[-1]],[9/math.sqrt(97),4/math.sqrt(97)])
        d=[math.exp(-.5),math.exp(-1)]
        vp=[[d[0]+1j*math.sqrt(1-d[0]**2),0],[0,d[1]+1j*math.sqrt(1-d[1]**2)]]
        vm=adj(vp); self.unitary(vp); self.unitary(vm)
        self.close(scale(.5,add(vp,vm)),[[d[0],0],[0,d[1]]])

    def test_sdp_gibbs_optimum(self):
        eta=math.log(3); p1=math.exp(-eta)/(1+math.exp(-eta))
        self.close(p1,.25)
        success=.5+1/6; self.close(success,2/3)
        accepted=[(1/math.sqrt(2))/math.sqrt(success),(1/math.sqrt(6))/math.sqrt(success)]
        self.close([abs(x)**2 for x in accepted],[.75,.25])

    def test_sdp_feasibility_loop(self):
        epsilon=.1; eta=epsilon/4; cap=math.ceil(16*math.log(2)/epsilon**2)+1
        def run(lo,hi):
            penalty=0
            for t in range(cap):
                population=1/(1+math.exp(eta*penalty))
                if population>hi+3*epsilon/4: penalty+=1
                elif population<lo-3*epsilon/4: penalty-=1
                else:return t,population
            return None
        result=run(.25,.25)
        self.assertEqual(result[0],30)
        self.close(result[1],1/(1+math.exp(.75)))
        self.assertLessEqual(abs(result[1]-.25),epsilon)
        self.assertIsNone(run(.75,.25))

if __name__=='__main__':
    print('Ideal classical numerical checks; no hardware observations.')
    print('qDRIFT exact P(1) =',4/5*math.sin(math.sqrt(5)*.3)**2)
    print('qDRIFT one-step P(1) =',2/3*math.sin(.9)**2)
    print('ODE final-time probability =',97/817)
    unittest.main(verbosity=2)
