var connection = require('./../DB/config');

module.exports.authenticate=function(req,res){

    var username=req.body.username;
    var password=req.body.password;

    connection.query('SELECT * FROM UserDetails WHERE username = ?',[username], function (error, results) {
      if (error) {
          res.json({
            status:false,
            message:'there are some error with query'
            })
      }
      else{
        if(results.length >0){
            if(password == results[0].password){

              if (req.session.username != results[0].username) {
                req.session.username = results[0].username;
                res.locals.username = req.session.username;
              }

              if(results[0].is_hr == 1){
                res.redirect('/HR-Home');
              }
              else{
                res.redirect('/User-Home');
              }
            }
            else{
                res.json({
                  status:false,
                  message:"Email and password does not match"
                 });
            }
        }
        else{
          res.json({
              status:false,
            message:"Email does not exits"
          });
        }
      }
    });
}
