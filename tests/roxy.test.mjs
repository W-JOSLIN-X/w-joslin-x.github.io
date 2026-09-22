import test from 'node:test';
import assert from 'node:assert/strict';
import {matchesPost} from '../src/utils/roxy-filter.mjs';
const post={title:'Markdown 写作',text:'包含梯度下降与图片',category:'学习笔记',tags:['Markdown','写作'],moods:['🤔 思考','🌿 平静']};
test('title search excludes body-only hits; full text includes them',()=>{assert.equal(matchesPost(post,{q:'梯度'}),false);assert.equal(matchesPost(post,{q:'梯度',scope:'full'}),true)});
test('tags require AND while emotions use OR, combined with category',()=>{assert.equal(matchesPost(post,{tags:['Markdown','数学']}),false);assert.equal(matchesPost(post,{tags:['Markdown','写作'],moods:['😊 愉快','🤔 思考'],category:'学习笔记'}),true);assert.equal(matchesPost(post,{moods:['😊 愉快']}),false);assert.equal(matchesPost(post,{category:'随笔'}),false)});
test('search normalizes width and case and accepts empty filters',()=>{assert.equal(matchesPost(post,{q:'ＭＡＲＫＤＯＷＮ'}),true);assert.equal(matchesPost(post,{}),true);assert.equal(matchesPost(post,{q:'Markdown 不存在'}),false)});
