import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://bpzcafaystrwmukblixj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8')


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data,error} = await supabase.from('users').select('id, email, is_admin').eq('email', email).eq('password',password)

    if(error || data.length === 0)
    {
      res.status(401).json("User Not Found")
        return;
    }

    console.log(data)

    // if(data[0].password !== password)
    // {
    //     res.status(400).json("password did not matched")
    // }

    let role;
    if (data.length !== 0) {
      const user = data[0];
      if (email.startsWith('FA')) {
        role = 'faculty';
      } else if (email.startsWith('BT')) {
        role = 'students';
      } else {
        role = 'admin';
      }

      if(role === 'students' || role === 'faculty')
      {
          const {data : userData,error} = await supabase.from(role).select().eq('email',email);

          if(error || userData.length === 0)
          {
            res.status(400).json("User not found");
            return;
          }
          if(user.is_admin === true)
          {
            role = 'admin'
          }
          res.status(200).json({userData,role})
          return;
      }
      if(role === 'admin')
      {
          const userData=[
            {
                id:9999
            }
          ]
          res.status(200).json({userData,role})
          return;
      }

    }
    else{
        res.status(401).json("empty data")
        return;
    }

    res.status(200).json({data : data.id,role})
  } catch (error) {
    console.error('Login error:', error); // Debug log
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message || 'Unknown error'
    });
  }
}

export const sigin = async (req,res) => {
  try {
    const {email,password,role} = req.body;

    const {data} = await supabase.from('users').insert({
      email,
      password
    }).select();

    res.status(201).json(data);

  } catch (error) {
    console.log(error);
    res.status(404).json(error)
  }
}


export const updateAdminStatus = async (req, res) => {
  const { userId, isAdmin } = req.body;

  try {
    const { error } = await supabase
      .from('users')
      .update({ is_admin: isAdmin })
      .eq('id', userId);

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAccount = async (req,res) => {
  try {
    const { email, password } = req.body;

    let role;
    if (email.startsWith('FA')) {
      role = 'faculty';
    } else if (email.startsWith('BT')) {
      role = 'students';
    } else {
      role = 'admin';
    }

    if(role === 'students' || role === 'faculty')
    {
      const {data : userData,error} = await supabase.from(role).select().eq('email',email);

      if(error || userData.length === 0)
        {
          res.status(400).json("User not found");
          return;
        }
      
        const { data: newAccount, error: newError } = await supabase.from('users').insert({
          email: email,
          password: password 
        }).select();
  

        if(newError){
          res.status(400).json(newError.message);
        }

        res.status(200).json({userData,role})
    }

    else{
      const {data : newAccount,newError} = await supabase.from('users').insert(email,password).select();

      if(newError){
        res.status(400).json(newError.message);
      }

      res.status(200).json({newAccount,role})
    }
  } catch (error) {
    
  }
}