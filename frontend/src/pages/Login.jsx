import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

function Login() {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [type, settype] = useState("Worker");
  const queryClient=useQueryClient()

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async ({ username, password, type }) => {
      console.log("entered the login block..., prashanth")
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password, type })
      });
      console.log("exited the login page")
      // console.log(res.message)
      const data = await res.json();

      
      if (!res.ok) {
        console.log(data.message)
        // If response is not OK, throw the error data
        throw new Error(data.message || 'Login failed');
      }
      
      return res;
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['authUser']})
    }
  });

  const HandelLogin = (e) => {
    e.preventDefault();
    mutate({ username, password, type });
  };

  return (
    <>
      {!isPending &&
        <div style={{ margin: "0px 0px 0px 0vw" }} >
          <h1 className="text-6xl font-bold" style={{ margin: "10px 0px 0px 35vw" }}>Sign up Today</h1>
          <div className="hero bg-base-2 min-h-20" >
            <div className="hero-content flex-col lg:flex-row-reverse">
              <div className="text-center lg:text-left"></div>
              <div className="card bg-base-1 w-auto max-w-sm shrink-0 shadow-2xl">
                <div className="card-body">
                  <fieldset className="fieldset">
                    <label className="label">Enter credentials</label>
                    <input type="text email" name="email" value={username} onChange={(e) => { setusername(e.target.value) }} className="input" placeholder="phoneNumber/gmail/phone number" />
                    
                    <label className="label">Password</label>
                    <input type="password" name="password" value={password} onChange={(e) => { setpassword(e.target.value) }} className="input" placeholder="Password" />

                    <div className=''>Select Type of Acc</div>
                    <div className="my-2">
                      <label className="label cursor-pointer flex items-center gap-2">
                        <input
                          type="radio"
                          name="radio-4"
                          className="radio radio-primary my-2"
                          defaultChecked
                          onClick={() => { settype("Worker") }}
                        />
                        <span className="label-text">Worker</span>
                      </label>

                      <label className="label cursor-pointer flex items-center gap-2">
                        <input
                          type="radio"
                          name="radio-4"
                          className="radio radio-primary"
                          onClick={() => { settype("Contractor") }}
                        />
                        <span className="label-text">Contractor</span>
                      </label>
                    </div>
                    
                    {isError && (
                      <div className="text-red-500 p-2 mb-4 rounded">
                        {error?.message || 'Unable to login - check credentials'}
                      </div>
                    )}
                    
                    <button className="btn btn-neutral " onClick={HandelLogin}>Login</button>
                    <p className="text-2xl ">Want to create new account?</p>
                    <Link to="/signup"><button className="btn btn-neutral mt-4" style={{ width: "350px" }}>Signup</button></Link>
                  </fieldset>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      {isPending && <div>loading....</div>}
    </>
  )
}

export default Login;