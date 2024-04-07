export default {
	//根据id 获取用户信息
	getUserDetail: function(userid, fn) {  
		uni.request({
		    url: 'http://172.168.1.33:442/findUserWithID', 
			method: 'POST',
			data: {
				"userID": userid
			},
		    success: (res) => {
				fn(res.data[0]);
			}
		});
	},

}