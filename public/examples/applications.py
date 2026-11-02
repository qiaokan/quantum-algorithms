"""Independent small-matrix checks for lessons38–61.
Run: python3 -m pip install numpy; python3 public/examples/applications.py
All results are ideal classical calculations, not hardware observations.
Register order is big-endian. No silent renormalization of unitary outputs.
"""
import math
import unittest
import numpy as np

I=np.eye(2,dtype=complex)
X=np.array([[0,1],[1,0]],complex)
Y=np.array([[0,-1j],[1j,0]],complex)
Z=np.diag([1,-1]).astype(complex)
H=np.array([[1,1],[1,-1]],complex)/math.sqrt(2)
CNOT=np.array([[1,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,1,0]],complex)

def ry(theta):
    c,s=np.cos(theta/2),np.sin(theta/2)
    return np.array([[c,-s],[s,c]],complex)

def exp_hermitian(a,t):
    vals,vecs=np.linalg.eigh(a)
    return (vecs*np.exp(-1j*t*vals))@vecs.conj().T

def tree_walk(marked=True):
    # basis root, x0=0, x0=1, x=00, x=01; depth bound n=2
    root_direction=np.array([1,np.sqrt(2),np.sqrt(2),0,0])/np.sqrt(5)
    ra=np.eye(5)-2*np.outer(root_direction,root_direction)
    ra[3,3]=-1
    ra[4,4]=1 if marked else -1
    child_direction=np.array([0,1,0,1,1])/np.sqrt(3)
    rb=np.eye(5)-2*np.outer(child_direction,child_direction)
    rb[2,2]=-1
    return rb@ra,ra,rb

def qpe_zero_branch(u,initial,count):
    # Actual zero-bin Kraus operator of a count-dimensional QPE register.
    vector=initial.copy(); total=np.zeros_like(vector)
    for _ in range(count):
        total+=vector
        vector=u@vector
    return total/count

def metropolis_projectors():
    # Coordinates are energy eigenstate, new-energy label, acceptance flag.
    # The physical system Hamiltonian is V diag(0,ln2) V†, V=Ry(pi/4).
    c=np.kron(H,np.eye(4))
    energy=np.zeros((8,8),complex)
    for j in range(8): energy[j^2 if j&4 else j,j]=1
    accept=np.zeros((8,8),complex)
    for j in range(0,8,2): accept[j:j+2,j:j+2]=H if j&2 else X
    u=accept@energy@c
    q=[u.conj().T@np.diag([int(j%2==s) for j in range(8)])@u for s in [0,1]]
    p=np.diag([int(j<4) for j in range(8)])
    return u,q,p

class WorkedExamples(unittest.TestCase):
    def assertClose(self,a,b,tol=1e-10): np.testing.assert_allclose(a,b,atol=tol,rtol=0)
    def test_coined_three_steps(self):
        state={(0,0):1.0}
        for _ in range(3):
            out={}
            for (x,c),a in state.items():
                for d in [0,1]:
                    key=(x+(-1 if d==0 else 1),d)
                    out[key]=out.get(key,0)+a*H[d,c]
            state=out
            self.assertClose(sum(abs(a)**2 for a in state.values()),1)
        probs=[sum(abs(a)**2 for (x,c),a in state.items() if x==pos) for pos in [-3,-1,1,3]]
        self.assertClose(probs,[1/8,5/8,1/8,1/8])
    def test_continuous_transfer(self):
        for t in [0,np.pi/6,np.pi/4,np.pi/2,np.pi]:
            u=exp_hermitian(X,t)
            self.assertClose(u.conj().T@u,I)
            self.assertClose(u@np.array([1,0]),[np.cos(t),-1j*np.sin(t)])
    def test_szegedy_reflections(self):
        p0=np.array([np.sqrt(3)/2,1/2]);p1=p0[::-1]
        ra=np.zeros((4,4));ra[:2,:2]=2*np.outer(p0,p0)-np.eye(2);ra[2:,2:]=2*np.outer(p1,p1)-np.eye(2)
        swap=np.eye(4)[[0,2,1,3]];rb=swap@ra@swap
        w=rb@ra;self.assertClose(w.T@w,np.eye(4))
        self.assertClose(w[:,0],[1/4,-np.sqrt(3)/4,np.sqrt(3)/4,3/4])
        pi=np.r_[p0,p1]/np.sqrt(2);self.assertClose(w@pi,pi)
    def test_complete_graph_search(self):
        for n in [4,9,16]:
            initial=np.ones(n)/np.sqrt(n); marked=np.eye(n)[:,2]
            h=-np.outer(initial,initial)-np.outer(marked,marked)
            for t in [0,np.pi/2,np.pi*np.sqrt(n)/2]:
                actual=exp_hermitian(h,t)@initial
                expected=np.exp(1j*t)*(np.cos(t/np.sqrt(n))*initial+1j*np.sin(t/np.sqrt(n))*marked)
                self.assertClose(actual,expected)
                self.assertClose(np.vdot(actual,actual),1)
            self.assertClose(abs(actual)**2,abs(marked)**2)
        s=np.ones(4)/2;h=-np.outer(s,s)-np.diag([0,0,1,0])
        self.assertClose(abs(exp_hermitian(h,np.pi/2)@s)**2,[1/8,1/8,5/8,1/8])
    def test_szegedy_spectrum_and_coherent_filter(self):
        p=np.array([[.75,.25],[.25,.75]])
        a=np.zeros((4,2));a[:2,0]=np.sqrt(p[0]);a[2:,1]=np.sqrt(p[1])
        swap=np.eye(4)[[0,2,1,3]];b=swap@a
        w=(2*b@b.T-np.eye(4))@(2*a@a.T-np.eye(4))
        stationary=a@np.ones(2)/np.sqrt(2)
        extra=np.array([1,-np.sqrt(3),-np.sqrt(3),1])/(2*np.sqrt(2))
        self.assertClose(w@extra,extra)
        self.assertClose(a.T@extra,[0,0]);self.assertClose(b.T@extra,[0,0])
        self.assertClose(a.T@b,p)
        eig,vec=np.linalg.eig(w)
        phases=np.sort(np.angle(eig));self.assertClose(phases,[-2*np.pi/3,0,0,2*np.pi/3])
        self.assertClose(qpe_zero_branch(w,stationary,4),stationary)
        for j,z in enumerate(eig):
            if abs(z-1)<1e-9:continue
            v=vec[:,j];self.assertClose(qpe_zero_branch(w,v,4),v/4)
            # Build the actual four-label controlled-power/QFT circuit.
            f=np.exp(-2j*np.pi*np.outer(np.arange(4),np.arange(4))/4)/2
            prep=np.kron(H,H);phase=np.diag(z**np.arange(4));qpe=f@phase@prep
            reflection=qpe.conj().T@np.diag([1,-1,-1,-1])@qpe
            e0=np.eye(4)[:,0];self.assertClose(np.linalg.norm(reflection@e0+e0),1/2)
            self.assertClose(abs((qpe@e0)[0])**2,1/16)
    def test_bell_partial_trace(self):
        bell=np.array([1,0,0,1])/np.sqrt(2)
        rho=np.outer(bell,bell).reshape(2,2,2,2)
        reduced=np.trace(rho,axis1=1,axis2=3)
        self.assertClose(reduced,np.eye(2)/2)
        plus=np.ones(2)/np.sqrt(2)
        self.assertClose(H@np.outer(plus,plus)@H,np.diag([1,0]))
        self.assertClose(H@reduced@H,np.eye(2)/2)
    def test_subset_amplification(self):
        s=np.ones(6)/np.sqrt(6);marked=s.copy();marked[1]*=-1
        final=(2*np.outer(s,s)-np.eye(6))@marked
        self.assertClose(abs(final[1])**2,49/54)
        self.assertClose(np.vdot(final,final),1)
    def test_backtracking_walk_and_phase_filter(self):
        root=np.eye(5)[:,0];phi=np.array([np.sqrt(2),-1,0,0,1])/2
        w,ra,rb=tree_walk(True)
        self.assertClose(ra.T@ra,np.eye(5));self.assertClose(rb.T@rb,np.eye(5));self.assertClose(w@phi,phi)
        yes=qpe_zero_branch(w,root,64)
        no=qpe_zero_branch(tree_walk(False)[0],root,64)
        self.assertClose(np.vdot(yes,yes),0.5003304993316477)
        self.assertClose(np.vdot(no,no),0.0018190815683739128)
        self.assertClose(abs(yes[4])**2,0.1258996164050444)
    def test_vqe_against_eigensolver(self):
        operator=X+Z;psi=ry(-3*np.pi/4)@np.array([1,0])
        self.assertClose(np.vdot(psi,operator@psi),np.linalg.eigvalsh(operator)[0])
        self.assertClose(abs(psi)**2,[(2-np.sqrt(2))/4,(2+np.sqrt(2))/4])
    def test_adapt_gradients(self):
        psi=np.array([1,0]);operator=X+Z
        gradients=[np.vdot(psi,1j/2*(p@operator-operator@p)@psi).real for p in [X,Y]]
        self.assertClose(gradients,[0,1])
        eps=1e-5
        def energy(t):
            v=ry(t)@psi;return np.vdot(v,operator@v).real
        self.assertClose((energy(eps)-energy(-eps))/(2*eps),1,tol=1e-9)
    def test_qaoa_one_edge(self):
        cost=np.diag([0,1,1,0]);mixer=np.kron(X,I)+np.kron(I,X)
        psi=exp_hermitian(mixer,np.pi/8)@exp_hermitian(cost,np.pi/2)@np.ones(4)/2
        self.assertClose(psi,[0,-1j/np.sqrt(2),-1j/np.sqrt(2),0])
        self.assertClose(np.vdot(psi,cost@psi),1)
    def test_imaginary_time_filter(self):
        initial=np.ones(2)/np.sqrt(2);filtered=np.diag([1,1/2])@initial
        probability=np.vdot(filtered,filtered).real
        self.assertClose(probability,5/8)
        conditioned=filtered/np.sqrt(probability) # explicit conditional-state normalization
        rotated=ry(2*np.arctan(.5)-np.pi/2)@initial
        self.assertClose(conditioned,rotated);self.assertClose(abs(rotated)**2,[4/5,1/5])
    def test_finite_adiabatic_path(self):
        duration=10.;omega=np.pi/(2*duration);r=np.sqrt(1+omega**2/4)
        frame=exp_hermitian(-X+omega*Y/2,duration)@np.ones(2)/np.sqrt(2)
        final=ry(-np.pi/2)@frame
        exact_fail=(omega/(2*r))**2*np.sin(r*duration)**2
        self.assertClose(abs(final[1])**2,exact_fail)
        self.assertLessEqual(exact_fail,np.pi**2/(16*duration**2+np.pi**2))
        # Independent midpoint-product integration of the changing physical Hamiltonian.
        steps=10000;dt=duration/steps;numeric=np.ones(2,dtype=complex)/np.sqrt(2)
        for j in range(steps):
            t=(j+.5)*dt;ham=-np.cos(omega*t)*X-np.sin(omega*t)*Z
            numeric=(np.cos(dt)*I-1j*np.sin(dt)*ham)@numeric
        self.assertClose(numeric,final,tol=2e-7)
    def test_tomography(self):
        psi=np.array([np.sqrt(3)/2,1j/2]);rho=np.outer(psi,psi.conj())
        xyz=[np.vdot(psi,p@psi).real for p in [X,Y,Z]]
        self.assertClose(xyz,[0,np.sqrt(3)/2,.5])
        self.assertClose((I+xyz[0]*X+xyz[1]*Y+xyz[2]*Z)/2,rho)
    def test_shadow_unbiasedness(self):
        rho=np.diag([1,0]);mean=np.zeros((2,2),complex);second=0
        for pauli in [X,Y,Z]:
            values,vectors=np.linalg.eigh(pauli)
            for j in range(2):
                projector=np.outer(vectors[:,j],vectors[:,j].conj())
                prob=np.trace(rho@projector).real/3;snapshot=3*projector-I
                mean+=prob*snapshot;second+=prob*np.trace(Z@snapshot).real**2
        self.assertClose(mean,rho);self.assertClose(second,3)
    def test_kernel_classifier(self):
        xs=[0,np.pi/2,np.pi];states=[ry(x)@np.array([1,0]) for x in xs]
        gram=np.array([[abs(np.vdot(a,b))**2 for b in states] for a in states])
        self.assertClose(gram,[[1,.5,0],[.5,1,.5],[0,.5,1]])
        self.assertGreaterEqual(np.linalg.eigvalsh(gram).min(),0)
    def test_classifier_parameter_shift(self):
        def p(theta,x=0):return abs((ry(theta)@ry(x)@np.array([1,0]))[1])**2
        self.assertClose((p(np.pi)-p(0))/2,.5)
        self.assertClose(p(0),0);self.assertClose(p(0,np.pi),1)
    def test_iqp(self):
        hh=np.kron(H,H)
        for t in [np.pi/6,np.pi/4,np.pi/2]:
            psi=hh@exp_hermitian(-np.kron(Z,Z),t)@hh@np.array([1,0,0,0])
            self.assertClose(psi,[np.cos(t),0,0,1j*np.sin(t)])
    def test_gaussian_photon_sectors(self):
        # Expanding transformed creation-operator powers; sector k has2k photons.
        for k in [0,1,2,3,4]:
            probabilities=[]
            for j in range(k+1):
                amplitude=(-1)**j*math.comb(k,j)*np.sqrt(math.factorial(2*(k-j))*math.factorial(2*j))/(2**k*math.factorial(k))
                probabilities.append(amplitude**2)
            self.assertClose(sum(probabilities),1)
            if k==1:self.assertClose(probabilities,[.5,.5])
            if k==2:self.assertClose(np.array(probabilities)*(3/64),[9/512,3/256,9/512])
    def test_rcs_and_metric_counterexample(self):
        psi=np.kron(H,I)@np.kron(I,ry(np.pi/3))@CNOT@np.kron(H,I)@np.array([1,0,0,0])
        p=abs(psi)**2
        self.assertClose(p,[(2-np.sqrt(3))/8,(2+np.sqrt(3))/8,(2+np.sqrt(3))/8,(2-np.sqrt(3))/8])
        self.assertClose(4*np.dot(p,p)-1,.75)
        self.assertGreater(4*p[1]-1,.75)
    def test_kuperberg_label_combination(self):
        n,s,k,l=8,3,1,3
        phase=lambda label:np.array([1,np.exp(2j*np.pi*label*s/n)])/np.sqrt(2)
        joint=CNOT@np.kron(phase(k),phase(l));branch=joint[[0,2]]
        self.assertClose(np.vdot(branch,branch),.5)
        self.assertClose(branch/np.sqrt(.5),phase(k+l))
        self.assertClose(abs(H@phase(4))**2,[0,1])
    def test_jones_trace_and_correction(self):
        a=1j*np.exp(-1j*np.pi/10);d=2*np.cos(np.pi/5)
        e=np.diag([d,0]);u=a*e+np.eye(2)/a
        self.assertClose(u.conj().T@u,np.eye(2))
        trace=u[0,0]/d**2+(1-1/d**2)*u[1,1]
        self.assertClose(trace,.5-.3632712640026804j)
        self.assertClose((-a)**3*d*trace,1)
    def test_metropolis_rejection_and_stationary_state(self):
        u,q,p=metropolis_projectors();v=np.eye(8)[:,0]
        self.assertClose(u.conj().T@u,np.eye(8))
        reject=q[0]@v;reject_probability=np.vdot(reject,reject).real
        self.assertClose(reject_probability,.25)
        reject/=np.sqrt(reject_probability) # explicit conditioning on rejection
        self.assertClose(np.vdot(p@reject,p@reject),.5)
        fail=(np.eye(8)-p)@reject
        rho=np.outer(fail,fail.conj()) # unnormalized conditional failure branch
        for k in range(1,11):
            f=np.eye(8)-p
            rho=sum(f@qq@rho@qq@f for qq in q)
            self.assertClose(np.trace(rho),.5*(.75**k))
        transition=np.array([[.75,.25],[.5,.5]])
        self.assertClose(np.array([2/3,1/3])@transition,[2/3,1/3])
    def test_forrelation_two_and_one_query(self):
        h2=np.kron(H,H);f=np.array([1,1,1,-1])
        for g,phi in [(f,1),(np.array([1,-1,-1,-1]),0)]:
            final=h2@(g*(h2@(f/2)))
            self.assertClose(final[0],phi)
            branch0=f/2;branch1=h2@(g/2)
            zero=(branch0+branch1)/2
            self.assertClose(np.vdot(zero,zero),(1+phi)/2)

if __name__=='__main__':
    unittest.main(verbosity=2)
