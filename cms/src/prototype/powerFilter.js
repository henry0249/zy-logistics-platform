import Vue from 'vue'
let keyArr = [{
    key: 'sys',
    keyValue: '系统管理员',
    IO: {
      userIo: false,
      platformIo: false,
      companyIo: false,
    }
  },
  {
    key: 'platform_admin',
    keyValue: '平台管理员',
    IO: {
      companyIo: false,
      userIo: false,
    }
  },
  {
    key: 'company_admin',
    keyValue: '公司管理员',
    IO: {
      userIo: false,
    }
  }
]
let io = false
let powerIO = {
  userIo: false,
  platformIo: false,
  companyIo: false,
}

function powerFilter(data) {
  if (Array.isArray(data)) {} else {
    for (let index = 0; index < keyArr.length; index++) {
      for (let i = 0; i < data.role.length; i++) {
        if (keyArr[index].key == data.role[i]) {
          io = true
          for (const k in keyArr[index].IO) {
            if (keyArr[index].IO.hasOwnProperty(k)) {
              keyArr[index].IO[k] = true
              powerIO[k] = true
            }
          }
        }
      }
    }
    if (!io) {
      for (const key in powerIO) {
        if (powerIO.hasOwnProperty(key)) {
          powerIO[key] = false
        }
      }
    }
    return powerIO
  }
}
export default powerFilter
