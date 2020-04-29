import request from '@/utils/request'

export function getAllInvitationList(queryInfo) {
  return request({
    url: `/forum/posts`,
    method: 'get',
    params: queryInfo
  })
}

export function getInvitationList(clubid, query, originState) {
  return request({
    url: `/forum/${clubid}/posts`,
    method: 'get',
    params: { query, originState }
  })
}

export function getAllInvitationDetail(id, queryInfo) {
  return request({
    url: `/forum/posts/${id}`,
    method: 'get',
    params: queryInfo
  })
}

export function getInvitationDetail(id) {
  return request({
    url: `/forum/posts/${id}`,
    method: 'get'
  })
}

export function getRemarksList(actId, query) {
  return request({
    url: `/activity/${actId}/remarks`,
    method: 'get',
    params: query
  })
}

export function postComment(actId, data) {
  return request({
    url: `/forum/posts/${actId}/remarks`,
    method: 'post',
    data
  })
}
